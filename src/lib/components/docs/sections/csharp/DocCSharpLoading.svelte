<!-- src/lib/components/docs/sections/csharp/DocCSharpLoading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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
</script>

<div class="doc-page">
  <h1>Loading — Sync, Async &amp; Foreign Formats</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. See
    <a href="#csharp-api--hot-reload">Hot Reload</a> for
    <code>FileSystemWatcher</code>-backed live config reloading.
  </p>

  <CodeBlock code={loadingApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Sync vs Async</strong>
    <ul>
      <li><strong>Use the async overloads</strong> on a UI thread (WPF, MAUI, a Unity coroutine wrapping the <code>Task</code>) where blocking on file I/O would freeze the frame or the UI.</li>
      <li><strong>Use the sync overloads</strong> everywhere else — a console app, a server request handler already on a thread-pool thread, or Unity's main thread during a loading screen where you're going to block on something anyway.</li>
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
