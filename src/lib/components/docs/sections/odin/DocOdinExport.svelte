<!-- src/lib/components/docs/sections/odin/DocOdinExport.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const exportApi = `mdix.to_json(db, indented = true)   // (string, bool)
mdix.to_toml(db)                     // (string, bool)
mdix.to_mdix(db)                     // (string, bool)

mdix.format_source(source)           // (string, bool)
mdix.minify_source(source)           // string
mdix.compact_source(source)          // string — whitespace-only compaction
mdix.strip_comments(source)          // string — comments removed, formatting kept`;
</script>

<div class="doc-page">
  <h1>Export &amp; Source Transforms</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={exportApi} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'to_json(db, indented) / to_toml(db) / to_mdix(db)', d: 'Export the whole database as source text.' },
          { m: 'format_source(source)',   d: 'Reformat raw .mdix source text to the default pretty style.' },
          { m: 'minify_source(source)',   d: 'Aggressively shrink raw .mdix source text.' },
          { m: 'compact_source(source)',  d: 'Whitespace-only compaction — comments and structure untouched.' },
          { m: 'strip_comments(source)',  d: 'Remove comments, leaving formatting otherwise untouched.' },
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
