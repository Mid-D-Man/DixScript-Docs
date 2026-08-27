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
Dix.LoadToml(tomlString);

// Hot reload — re-read the same source path on demand
db.EnableHotReload();
// ... later, after the file on disk has changed:
MdixResult<MdixDatabase> reloaded = db.Reload();
var reloadedAsync = await db.ReloadAsync(ct);
db.DisableHotReload();`;
</script>

<div class="doc-page">
  <h1>Loading — Sync, Async &amp; Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>
  <CodeBlock code={loadingApi} lang="csharp" />
</div>
