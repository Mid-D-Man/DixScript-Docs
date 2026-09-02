<!-- src/lib/components/docs/sections/wasm/DocWasmReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@ENUMS(
  LogLevel { DEBUG, INFO, WARN, ERROR }
)

@DATA(
  app_name = "MyApp"
  session_id<long> = 9000000000
  ratio<float> = 0.75
  pi<double> = 3.14159265
  debug = true
  log_level = LogLevel.INFO

  server:
    host = "0.0.0.0"
    port<int> = 8080

  enemies:: "Goblin", "Orc", "Dragon"
)`;

  const readApi = `// All getters throw on missing path / type mismatch unless wrapped in tryGet()
db.isValid;                      // getter -> boolean
db.entryCount;                   // getter -> number

db.exists("server.host");        // boolean
db.getValueType("server.port");  // "int" | "string" | "bool" | ...

db.getString("server.host");     // string
db.getInt("server.port");        // number
db.getLong("session_id");        // bigint — NOT number, i64 crosses to JS as bigint
db.getFloat("ratio");            // number (f32)
db.getDouble("pi");              // number (f64)
db.getBool("debug");             // boolean
db.getJson("server");            // string — raw JSON of a nested object/array

db.getArrayLength("enemies");    // number
db.getKeys("server");            // string[] — direct children of "server"

db.getEnumName("log_level");     // "LogLevel"
db.getEnumField("log_level");    // "INFO"

// Export
db.toJson(true);   // pretty-printed JSON string
db.toToml();        // TOML string
db.toMdix();        // .mdix source string`;

  const bigintGotcha = `const sessionId = db.getLong("session_id"); // bigint, e.g. 9000000000n

sessionId + 1;        // TypeError — can't mix BigInt and other types
sessionId + 1n;        // 9000000001n — fine, both sides are bigint
Number(sessionId) + 1; // 9000000001 — fine, explicitly converted first

// Only relevant for long<int64> fields specifically. getInt()/getFloat()/
// getDouble() all return plain numbers — this is purely an i64 thing.`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={readApi} lang="javascript" />

  <div class="tip-callout">
    <strong>getLong returns a bigint, not a number</strong>
    <p>
      Rust's <code>i64</code> crosses the WASM boundary as a JS
      <code>bigint</code>, not a <code>number</code> — everything else here
      (int, float, double) is a plain <code>number</code>. Mixing a
      <code>bigint</code> into ordinary arithmetic throws a
      <code>TypeError</code> unless you convert first.
    </p>
    <CodeBlock code={bigintGotcha} lang="javascript" />
  </div>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Getter / Method</th><th>Returns</th></tr></thead>
      <tbody>
        {#each [
          { m: 'db.isValid',              r: 'boolean' },
          { m: 'db.entryCount',            r: 'number' },
          { m: 'db.exists(path)',          r: 'boolean' },
          { m: 'db.getValueType(path)',    r: 'string — "int" | "string" | "bool" | ...' },
          { m: 'db.getKeys(prefix)',       r: 'string[]' },
          { m: 'db.getArrayLength(path)',  r: 'number' },
          { m: 'db.getLong(path)',         r: 'bigint' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.r}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); display: block; margin-bottom: 0.375rem; }
  .tip-callout p { color: var(--muted-foreground); line-height: 1.6; margin: 0 0 0.75rem; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
