<!-- src/lib/components/docs/sections/wasm/DocWasmReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `// All getters throw on missing path / type mismatch unless wrapped in tryGet()
db.isValid;                      // getter -> boolean
db.entryCount;                   // getter -> number

db.exists("server.host");        // boolean
db.getValueType("server.port");  // "int" | "string" | "bool" | ...

db.getString("server.host");     // string
db.getInt("server.port");        // number
db.getLong("session_id");        // bigint-range number (i64)
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
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>
  <CodeBlock code={readApi} lang="javascript" />

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
