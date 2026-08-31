<!-- src/lib/components/docs/sections/csharp/DocCSharpLoading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  debug<bool> = false
)

// Edit and save this file while the hot-reload example below is
// running — FileSystemWatcher fires almost immediately.`;

  const loadingApi = `using MidManStudio.Mdix;
using MidManStudio.Mdix.Core;

// Sync
Dix.Load(path);
Dix.LoadStr(source);
Dix.LoadEncrypted(encPath, keyPath: null);
Dix.LoadEncryptedPassword(encPath, password);
Dix.LoadEncryptedBytes(bytes, keyContent, password: null);
Dix.LoadEncryptedWith(encPath, new MdixLoadOptions { /* ... */ });

// Async — same names, +Async, take a CancellationToken
await Dix.LoadAsync(path, ct);
await Dix.LoadStrAsync(source, ct);
await Dix.LoadEncryptedAsync(encPath, keyPath, ct);
await Dix.LoadEncryptedPasswordAsync(encPath, password, ct);
await Dix.LoadEncryptedBytesAsync(bytes, keyContent, password, ct);

// Foreign formats
Dix.LoadJson(jsonString);
Dix.LoadToml(tomlString);`;

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
  <h1>Loading — Sync, Async &amp; Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={loadingApi} lang="csharp" />

  <h2>Hot Reload</h2>
  <p>
    Genuinely different from every other language binding here — this is
    backed by a real <code>FileSystemWatcher</code>, not polling. Changes
    fire near-instantly (debounced ~500ms to collapse rapid successive
    writes from one save) rather than waiting for the next tick of a poll
    loop.
  </p>
  <CodeBlock code={hotReloadApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Sync vs Async, and hot reload gotchas</strong>
    <ul>
      <li><strong>Use the async overloads</strong> on a UI thread (WPF, MAUI, a Unity coroutine wrapping the <code>Task</code>) where blocking on file I/O would freeze the frame or the UI.</li>
      <li><strong>Use the sync overloads</strong> everywhere else — a console app, a server request handler already on a thread-pool thread, or Unity's main thread during a loading screen where you're going to block on something anyway.</li>
      <li><strong>Hot reload requires <code>Load(path)</code>, not <code>LoadStr(source)</code></strong> — there's no file for <code>FileSystemWatcher</code> to watch for an in-memory source, so <code>EnableHotReload()</code> throws immediately if you try.</li>
      <li><strong>Avoid</strong> assuming a failed reload leaves you in an unknown state — it doesn't. If the file is briefly invalid mid-save, <code>Reload()</code> returns a failure <em>and</em> your existing <code>db</code> keeps its last-good data untouched; nothing needs a rollback.</li>
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
