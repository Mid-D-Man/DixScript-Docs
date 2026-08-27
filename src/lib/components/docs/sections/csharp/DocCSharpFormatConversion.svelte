<!-- src/lib/components/docs/sections/csharp/DocCSharpFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const converterApi = `using MidManStudio.Mdix.Core;

MdixResult<string> mdix = Dix.ToMdix(db, MdixFormatMode.Default);  // or .Pretty / .Compact / .Minified
MdixResult<string> json = Dix.ToJson(db, indented: true);
MdixResult<string> toml = Dix.ToToml(db);

MdixResult<string> formatted = Dix.Format(sourceText, MdixFormatMode.Default);
MdixResult<string> minified  = Dix.Minify(sourceText);

// Static equivalents live on MdixConverter too, if you prefer not to go
// through the Dix facade:
MdixConverter.ToJson(db);
MdixConverter.FromJson(jsonString);

// Clear the internal type-conversion cache (rarely needed — e.g. after
// hot-reloading many schema shapes in a long-running process)
Dix.ClearSerializerCache();`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>
  <CodeBlock code={converterApi} lang="csharp" />
</div>
