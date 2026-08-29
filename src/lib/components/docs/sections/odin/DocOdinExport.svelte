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
</div>
