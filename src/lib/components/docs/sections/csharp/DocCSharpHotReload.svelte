<!-- src/lib/components/docs/sections/csharp/DocCSharpHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  debug<bool> = false
)

// Edit and save this file while the hot-reload example below is
// running — FileSystemWatcher fires almost immediately.`;

  const hotReloadApi = `using var db = Dix.Load("config.mdix").OrThrow();

db.OnReloaded     += reloaded => Console.WriteLine("config reloaded");
db.OnReloadFailed += err      => Console.WriteLine($"reload failed: {err}");

db.EnableHotReload(); // requires Load(path) — throws InvalidOperationException
                       // if db came from LoadStr(), since there's no file to watch

// ...later, if you want to force a check right now instead of waiting
// for the FileSystemWatcher event:
MdixResult<MdixDatabase> reloaded = db.Reload();
var reloadedAsync = await db.ReloadAsync(ct);

// db itself is updated in place on success — reloaded.SuccessResult and
// db are the same reference, you never swap which object you're holding

db.DisableHotReload();`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. Genuinely
    different from every other language binding here — this is backed by a
    real <code>FileSystemWatcher</code> (OS-level change notifications), not
    polling. Changes fire near-instantly (debounced ~500ms to collapse rapid
    successive writes from one save) rather than waiting for the next tick
    of a poll loop.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={hotReloadApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Hot reload gotchas</strong>
    <ul>
      <li><strong>Requires <code>Load(path)</code>, not <code>LoadStr(source)</code></strong> — there's no file for <code>FileSystemWatcher</code> to watch for an in-memory source, so <code>EnableHotReload()</code> throws immediately if you try.</li>
      <li><strong>Avoid</strong> assuming a failed reload leaves you in an unknown state — it doesn't. If the file is briefly invalid mid-save, <code>Reload()</code> returns a failure <em>and</em> your existing <code>db</code> keeps its last-good data untouched; nothing needs a rollback.</li>
      <li><strong><code>db</code> is mutated in place</strong> on a successful reload — <code>OnReloaded</code>'s handler argument, <code>Reload()</code>'s <code>SuccessResult</code>, and the <code>db</code> reference you already hold are all the same object; you never swap which instance you're holding.</li>
    </ul>
  </div>

  <div class="table-scroll" style="margin-top:1.5rem">
    <table>
      <thead><tr><th>Member</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'db.EnableHotReload()',   d: 'Starts watching the file db was Load()-ed from. Throws if db came from LoadStr().' },
          { m: 'db.DisableHotReload()',  d: 'Stops watching.' },
          { m: 'db.OnReloaded',          d: 'Event, fires with the reloaded MdixDatabase on a successful reload.' },
          { m: 'db.OnReloadFailed',      d: 'Event, fires with the error on a failed reload attempt.' },
          { m: 'db.Reload() / ReloadAsync()', d: 'Force a check right now instead of waiting for the FileSystemWatcher event.' },
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
