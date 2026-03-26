<script lang="ts">
  const example = `// Immutable — cannot be reassigned after declaration
let name = "Alice"
let count<int> = 42

// Compile-time constant — value must be a literal
const MAX_RETRIES = 3
const API_VERSION = "v2"

// Mutable — explicitly marked, can be reassigned
let mut total = 0
total += item.price   // OK
total = recalculate() // OK`;
</script>

<section id="variables" class="doc-section">
  <h2>Variables</h2>
  <p>
    DixScript uses Rust-style variable semantics — immutable by default,
    explicit mutation with <code>let mut</code>.
  </p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'let',     type: 'immutable', desc: 'Default choice — cannot be reassigned'          },
      { key: 'const',   type: 'literal',   desc: 'Compile-time value — must be a literal'         },
      { key: 'let mut', type: 'mutable',   desc: 'Explicit mutation — can be reassigned freely'   },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</section>
