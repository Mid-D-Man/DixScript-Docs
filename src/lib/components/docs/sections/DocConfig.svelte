<!-- src/lib/components/docs/sections/DocConfig.svelte -->
<script lang="ts">
  const example = `@CONFIG(
  version            -> "1.0.0"
  encoding           -> "utf-8"
  author             -> "Your Name"
  features           -> "advanced"
  debug_mode         -> "off"
  error_handling     -> "halt"
  compatibility_mode -> "strict"
)`;
</script>

<div class="doc-page">
  <h1>@CONFIG</h1>
  <p class="page-lead">
    Controls compiler behaviour. All keys are optional. The section itself can be omitted entirely.
  </p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'version',            type: 'string', desc: 'File version string e.g. "1.0.0"' },
      { key: 'encoding',           type: 'string', desc: '"utf-8" (default) · "utf-16" · "ascii"' },
      { key: 'author',             type: 'string', desc: 'Author name or identifier' },
      { key: 'features',           type: 'string', desc: '"basic" (default) or "advanced"' },
      { key: 'debug_mode',         type: 'enum',   desc: '"off" | "regular" | "verbose"' },
      { key: 'error_handling',     type: 'enum',   desc: '"halt" | "continue" | "recover"' },
      { key: 'compatibility_mode', type: 'enum',   desc: '"strict" | "best_effort" | "permissive"' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</div>
