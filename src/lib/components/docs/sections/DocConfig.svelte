<script lang="ts">
  const example = `@CONFIG(
  version            -> "1.0.0"
  encoding           -> "utf-8"
  author             -> "Your Name"
  features           -> "advanced"
  debug_mode         -> "off"       // off | regular | verbose
  error_handling     -> "halt"      // halt | continue | recover
  compatibility_mode -> "strict"    // strict | best_effort | permissive
)`;
</script>

<section id="config" class="doc-section">
  <h2>@CONFIG</h2>
  <p>Controls compiler behaviour. All keys are optional.</p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'version',            type: 'string', desc: 'File version string e.g. "1.0.0"'                },
      { key: 'encoding',           type: 'string', desc: '"utf-8" (default), "utf-16", "ascii"'            },
      { key: 'author',             type: 'string', desc: 'Author name'                                     },
      { key: 'features',           type: 'string', desc: '"basic" (default) or "advanced"'                 },
      { key: 'debug_mode',         type: 'enum',   desc: '"off" | "regular" | "verbose"'                   },
      { key: 'error_handling',     type: 'enum',   desc: '"halt" | "continue" | "recover"'                 },
      { key: 'compatibility_mode', type: 'enum',   desc: '"strict" | "best_effort" | "permissive"'         },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</section>
