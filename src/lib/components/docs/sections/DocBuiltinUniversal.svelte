<!-- src/lib/components/docs/sections/DocBuiltinUniversal.svelte -->
<script lang="ts">
  const methods = [
    { name: '.toString()',             returns: 'string', desc: 'Convert any value to its string representation' },
    { name: '.type()',                 returns: 'string', desc: 'Return the type name of the value (e.g. "int", "string", "array")' },
    { name: '.isNull()',               returns: 'bool',   desc: 'True if the value is null' },
    { name: '.isNotNull()',            returns: 'bool',   desc: 'True if the value is not null' },
    { name: '.equals(other)',          returns: 'bool',   desc: 'True if this value equals the other (deep equality)' },
    { name: '.notEquals(other)',       returns: 'bool',   desc: 'True if this value does not equal the other' },
    { name: '.hashCode()',             returns: 'int',    desc: 'Return an integer hash code for the value' },
    { name: '.clone()',                returns: 'same',   desc: 'Return a deep copy of the value' },
    { name: '.toBytes()',              returns: 'array',  desc: 'Return a byte-array representation of the value' },
    { name: '.size()',                 returns: 'int',    desc: 'Return an estimated memory size in bytes' },
    { name: '.isEmpty()',              returns: 'bool',   desc: 'True if the value is considered empty (null, empty string, empty array, 0, false)' },
    { name: '.isNotEmpty()',           returns: 'bool',   desc: 'True if the value is not considered empty' },
    { name: '.defaultIfNull(default)', returns: 'same',   desc: 'Return this value if not null, otherwise return default' },
    { name: '.defaultIfEmpty(default)',returns: 'same',   desc: 'Return this value if not empty, otherwise return default' },
    { name: '.debug()',                returns: 'string', desc: 'Return a detailed debug string showing type, value, size, and emptiness' },
    { name: '.json()',                 returns: 'string', desc: 'Return a JSON-like string representation of the value' },
  ];

  const emptinessTable = [
    { type: 'null',      empty: 'always' },
    { type: 'string',    empty: 'when length is 0' },
    { type: 'array',     empty: 'when element count is 0' },
    { type: 'object',    empty: 'when key count is 0' },
    { type: 'int',       empty: 'when value == 0' },
    { type: 'float',     empty: 'when value == 0.0' },
    { type: 'double',    empty: 'when value == 0.0' },
    { type: 'bool',      empty: 'when value is false' },
  ];

  const usageExample = `@QUICKFUNCS(
  // Safe default fallback using universal methods
  ~safeString<string>(val<string>) {
    return val.defaultIfNull("").defaultIfEmpty("unknown")
  }

  // Build a tagged value including type metadata
  ~tagged<object>(val<string>, label<string>) {
    return {
      value = val
      label = label
      type  = val.type()
      empty = val.isEmpty()
    }
  }

  // Defensive object construction — guard against null inputs
  ~makeConfig<object>(host<string>, port<int>, name<string>) {
    let safe_host = host.defaultIfNull("localhost")
    let safe_name = name.defaultIfEmpty("unnamed")
    return {
      host = safe_host
      port = port
      name = safe_name
    }
  }

  // Equality comparison across two values of the same type
  ~sameAs<bool>(a<string>, b<string>) {
    return a.equals(b)
  }

  // Log-safe representation of any value
  ~describe<string>(val<string>) {
    if: val.isNull() { return "null" }
    return $"{val.type()}: {val.toString()}"
  }
)

@DATA(
  // QuickFunc calls only in @DATA — no instance method calls here
  cfg       = makeConfig("db.internal", 5432, "")
  same_test = sameAs("alpha", "alpha")
)`;

  const typeNames = [
    'null', 'bool', 'int', 'float', 'double', 'string',
    'date', 'timestamp', 'hexcolor', 'blob', 'regex',
    'array', 'object', 'tuple', 'enum',
  ];
</script>

<div class="doc-page">
  <h1>Universal Methods</h1>
  <p class="page-lead">
    Instance methods available on <strong>every</strong> DixScript value regardless of type.
    These can be called on any variable or intermediate result inside a
    <code>@QUICKFUNCS</code> function body. They are not available as direct property
    access in <code>@DATA</code> — use a QuickFunc wrapper to expose them.
  </p>

  <h2>Methods</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each methods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Type Names Returned by .type()</h2>
  <p>The string values returned by <code>.type()</code> for each DixScript type:</p>
  <div class="kv-table">
    {#each typeNames as t}
      <div class="kv-row" style="grid-template-columns: 1fr;">
        <code class="kv-key">{t}</code>
      </div>
    {/each}
  </div>

  <h2>Emptiness Rules for .isEmpty()</h2>
  <p>What counts as "empty" differs by type.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Type</th><th>Considered empty when</th></tr></thead>
      <tbody>
        {#each emptinessTable as row}
          <tr>
            <td><code>{row.type}</code></td>
            <td style="color:var(--muted-foreground)">{row.empty}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Usage Inside @QUICKFUNCS</h2>
  <pre><code>{usageExample}</code></pre>

  <h2>Chaining</h2>
  <p>
    Universal methods chain naturally with type-specific instance methods.
    The chain executes left to right — each call receives the result of the previous.
  </p>
  <pre><code>// Chain: trim → check emptiness → fall back to default
let clean = raw.trim().defaultIfEmpty("unnamed")

// Chain: convert to string → check length
let label = count.toString().defaultIfEmpty("0")

// Chain: get type → check equality
let is_int = value.type().equals("int")</code></pre>

  <h2>Notes</h2>
  <p>
    <code>.size()</code> returns an estimate, not an exact allocation measurement.
    It is useful for debugging and sanity checks, not for precise memory accounting.
    <code>.clone()</code> performs a deep copy — nested arrays and objects are fully
    duplicated, not shared. <code>.json()</code> uses a simple JSON-like serialisation
    that formats numbers and strings in JSON style, but is not guaranteed to round-trip
    through a JSON parser — use it for display and logging, not for data exchange.
  </p>
</div>
