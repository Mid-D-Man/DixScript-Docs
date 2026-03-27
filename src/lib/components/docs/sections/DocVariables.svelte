<!-- src/lib/components/docs/sections/DocVariables.svelte -->
<script lang="ts">
  const example = `// Immutable — cannot be reassigned after declaration
let name  = "Alice"
let count = 42

// Compile-time constant — value must be a literal (no expressions)
const MAX_RETRIES = 3
const API_VERSION = "v2"

// Mutable — explicitly marked, can be reassigned or updated
let mut total = 0
total += item.price
total = recalculate()

// Variables are scoped to the function body they appear in.
// They cannot appear directly inside @DATA — only inside @QUICKFUNCS.`;

  const scopingExample = `@QUICKFUNCS(
  ~buildUrl<string>(host<string>, port<int>, tls<bool>) {
    let scheme = tls ? "https" : "http"    // immutable
    let mut path = scheme + "://" + host   // mutable
    path += ":" + port.toString()          // reassign
    return path
  }
)`;

  const tupleNote = `// Tuples: mixed-type, fixed length, max 6 elements
let pos   = t:(10, 20)
let color = t:(255, 128, 0, 1.0f)     // RGBA — 4 elements
let meta  = t:("name", 42, true, #FF0000, 2025-01-15, null)  // exactly 6`;
</script>

<div class="doc-page">
  <h1>Variables</h1>
  <p class="page-lead">
    DixScript uses Rust-style variable semantics — immutable by default,
    explicit mutation with <code>let mut</code>. Variables are only valid inside
    <code>@QUICKFUNCS</code> function bodies. They cannot appear directly in
    <code>@DATA</code>.
  </p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'let',     type: 'immutable', desc: 'Default — bound to its initial value and cannot be reassigned.' },
      { key: 'const',   type: 'literal',   desc: 'Compile-time constant. Right-hand side must be a literal, not an expression.' },
      { key: 'let mut', type: 'mutable',   desc: 'Explicitly mutable — can be reassigned with = or updated with +=, -=, *=, /=, %=.' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Scoping</h2>
  <p>
    Variables are local to the function body in which they are declared. A variable
    declared in one QuickFunc is not visible in another.
  </p>
  <pre><code>{scopingExample}</code></pre>

  <h2>Tuple Variables</h2>
  <p>
    Tuples hold up to six elements of mixed types. They are primarily useful inside
    QuickFuncs when you need to bundle a small group of values without declaring a
    full object. The <code>t:(…)</code> constructor requires comma-separated elements.
  </p>
  <pre><code>{tupleNote}</code></pre>
</div>
