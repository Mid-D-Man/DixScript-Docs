<!-- src/lib/components/docs/sections/c/DocCHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const watchC = `void* w = mdix_watcher_new("config.mdix");
if (!w) { fprintf(stderr, "%s\\n", mdix_get_last_error()); return; }

for (;;) {
    void* fresh = mdix_watcher_check_and_reload(w);
    if (fresh) {
        apply_new_config(fresh);
        mdix_free(fresh);
    }
    /* NULL here means either "unchanged" or "error" — check
       mdix_get_last_error() if you need to tell them apart */
    tick();
}

mdix_watcher_free(w);`;

  const watchCpp = `mdix::Watcher watcher("config.mdix");
while (running) {
    if (auto fresh = watcher.check_and_reload()) {
        apply_new_config(*fresh);
    }
    tick();
}
// watcher's handle is freed automatically when it goes out of scope`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. Watches a single
    plaintext <code>.mdix</code> path via
    <code>dixscript::Runtime::HotReloadWatcher</code> — a cheap
    <code>stat()</code>-based poll, not an OS filesystem-event subscription
    (no <code>notify</code>/<code>inotify</code>/<code>FSEvents</code>
    dependency, identical behavior on every platform this ships to). Cheap
    enough to call every frame of a game loop or timer tick.
  </p>

  <CodeBlock code={watchC} lang="c" />
  <CodeBlock code={watchCpp} lang="cpp" />

  <div class="tip-callout">
    <strong>Gotchas</strong>
    <ul>
      <li><strong>Encrypted <code>.mdix</code> files are not supported</strong> — <code>force_reload()</code> always reloads through the plaintext loader path internally. A core Runtime limitation, not something this binding adds on top or could opt out of.</li>
      <li><strong>The first check always reports a change</strong> — <code>has_changed</code>/<code>check_and_reload</code> haven't read the file yet at construction time, so the very first call reloads unconditionally.</li>
      <li><strong><code>check_and_reload</code> only reloads on an actual change</strong> since the last <em>successful</em> reload (or since construction). On a reload failure, the watcher's internal modified-time stamp is <em>not</em> updated — the next call retries against the same file state instead of silently giving up on that change.</li>
      <li><strong><code>force_reload()</code> reloads unconditionally</strong>, regardless of whether the file changed — useful for an explicit "reload now" action distinct from the poll loop.</li>
    </ul>
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
