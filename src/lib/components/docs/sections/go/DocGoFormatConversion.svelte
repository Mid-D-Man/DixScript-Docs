<!-- src/lib/components/docs/sections/go/DocGoFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const converterApi = `// Export
json, err := dixscript.Convert.ToJSON(db, true)
mdix, err := dixscript.Convert.ToMdix(db, dixscript.FormatPretty)
toml, err := dixscript.Convert.ToToml(db)

// Import
db, err := dixscript.Convert.FromJSON(jsonStr)
db, err := dixscript.Convert.FromToml(tomlStr)

// Format source text
formatted, err := dixscript.Convert.FormatSource(src, dixscript.FormatCompact)
minified,  err := dixscript.Convert.MinifySource(src)`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={converterApi} lang="go" />
</div>
