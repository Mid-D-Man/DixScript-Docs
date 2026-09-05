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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Function</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'Convert.ToJSON(db, indented)',      d: 'Export as a JSON string.' },
          { m: 'Convert.ToMdix(db, formatMode)',     d: 'Export as .mdix source text.' },
          { m: 'Convert.ToToml(db)',                 d: 'Export as a TOML string.' },
          { m: 'Convert.FromJSON(json)',              d: 'Parse a JSON string into a new Database.' },
          { m: 'Convert.FromToml(toml)',              d: 'Parse a TOML string into a new Database.' },
          { m: 'Convert.FormatSource(src, mode)',     d: 'Reformat raw .mdix source text.' },
          { m: 'Convert.MinifySource(src)',           d: 'Aggressively shrink raw .mdix source text.' },
          { m: 'Convert.JSONRoundTrip(json)',         d: 'Parse then re-export JSON, useful for normalizing formatting.' },
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
