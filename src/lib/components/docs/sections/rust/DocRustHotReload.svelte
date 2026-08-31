<!-- src/lib/components/docs/sections/rust/DocRustHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyGame"
  debug<bool> = false
)

// Edit and save this file while the program below is running — the
// next check_and_reload() call in its loop will pick up the change.`;

  const hotReloadApi = `use dixscript::Runtime::HotReloadWatcher;

let mut watcher = HotReloadWatcher::new("config.mdix");

// in your game loop / tick / update — call this every frame, not just once:
fn on_tick(watcher: &mut HotReloadWatcher) {
    match watcher.check_and_reload() {
        Ok(Some(data)) => {
            let debug: bool = data.get_or_default("debug", false);
            println!("config reloaded, debug={debug}");
        }
        Ok(None) => {} // unchanged, nothing to do — this is the common case
        Err(e)   => eprintln!("hot reload failed: {e}"),
    }
}

// Encrypted source? Pass load options through the same way DixLoader would:
use dixscript::Runtime::DixLoadOptions;
let mut secure_watcher = HotReloadWatcher::new("secrets.mdix.enc")
    .with_options(DixLoadOptions::with_password("my-strong-password"));

// Force a reload regardless of whether the file actually changed —
// useful right after startup if you loaded a stale cached copy some
// other way and want to be sure you're in sync:
let data = watcher.force_reload()?;

// Check without reloading, if you want to log/react before paying for
// the actual re-parse:
if watcher.has_changed()? {
    println!("{} has unsaved changes on disk", watcher.path().display());
}

watcher.has_loaded(); // bool — true once at least one reload has succeeded`;
</script>

<div class="doc-page">
  <h1>HotReloadWatcher — Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Watches a single
    <code>.mdix</code> file and reloads it through the full
    <a href="#rust-api--loader"><code>DixLoader</code></a> pipeline only when
    its modified-time actually changes. Deliberately poll-based rather than
    OS-event-based — no <code>notify</code>/inotify/FSEvents dependency — a
    single <code>std::fs::metadata</code> call per check is cheap enough to
    run every frame, and it behaves identically on every platform DixScript
    ships bindings for, including targets with no filesystem-event backend
    at all.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={hotReloadApi} lang="rust" />

  <div class="tip-callout">
    <strong>check_and_reload vs force_reload</strong>
    <ul>
      <li><strong>Use <code>check_and_reload</code></strong> in a loop that runs constantly (a game's per-frame update, a server's request loop) — it's the cheap path, and only actually re-parses the file on the tick where something changed.</li>
      <li><strong>Use <code>force_reload</code></strong> right after constructing the watcher if you need data immediately, or to recover from a reload that failed and left the mtime stamp untouched — on failure (e.g. the file was saved mid-write and was briefly invalid), the stamp deliberately isn't updated, so the very next <code>check_and_reload</code> retries against the same change rather than silently giving up on it.</li>
      <li><strong>Avoid</strong> constructing a new <code>HotReloadWatcher</code> every tick — it holds no expensive resources itself, but doing so throws away the <code>last_modified</code> stamp, so every check reports a change and you lose the whole point of polling cheaply. Create one watcher per file, once, and keep it.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'HotReloadWatcher::new(path)',       d: 'Start watching a file. Does not read it yet — the first check_and_reload()/has_changed() call always reports a change.' },
          { m: '.with_options(opts)',               d: 'Use custom DixLoadOptions (e.g. for an encrypted source) instead of the defaults. Consumes and returns self.' },
          { m: '.path()',                           d: '&Path — the path being watched.' },
          { m: '.has_loaded()',                     d: 'bool — true once a successful reload has happened at least once.' },
          { m: '.has_changed()',                    d: 'Result<bool, String> — whether the mtime differs from the last successful reload, without reloading.' },
          { m: '.force_reload()',                   d: 'Result<DixData, String> — reloads unconditionally and updates the mtime stamp on success.' },
          { m: '.check_and_reload()',                d: 'Result<Option<DixData>, String> — reloads only if changed. Some(data) on a fresh reload, None if unchanged.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
