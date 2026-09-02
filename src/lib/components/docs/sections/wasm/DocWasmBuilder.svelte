<!-- src/lib/components/docs/sections/wasm/DocWasmBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const equivalentMdix = `@CONFIG(
  version -> "1.0.0"
)

@ENUMS(
  LogLevel { DEBUG, INFO, WARN, ERROR }
)

@DATA(
  app_name = "MyGame"
  port<int> = 8080
  ssl = true
  log_level = LogLevel.INFO

  server:
    host = "localhost"
    port<int> = 8080
    ssl  = true

  admins:: "alice", "bob"

  enemies::
    { name = "Goblin", hp<int> = 50  },
    { name = "Orc",    hp<int> = 100 }
)`;

  const builderApi = `import { MdixBuilder } from "@midmanstudio/mdix";

const db = new MdixBuilder()
  .setConfigVersion("1.0.0")
  .addEnum("LogLevel", JSON.stringify(["DEBUG", "INFO", "WARN", "ERROR"]))
  // Tier 1 — flat properties MUST come first
  .withString("app_name", "MyGame")
  .withInt("port", 8080)
  .withBool("ssl", true)
  .withEnumValue("log_level", "LogLevel", "INFO")
  // Tier 2 — grouped data, after all flat properties
  .withTableProperties("server", JSON.stringify({
    host: "localhost",
    port: 8080,
    ssl:  true
  }))
  .withGroupArray("admins", JSON.stringify(["alice", "bob"]))
  .withGroupArray("enemies", JSON.stringify([
    { name: "Goblin", hp: 50 },
    { name: "Orc",    hp: 100 }
  ]))
  .toDatabase();

console.log(db.getString("app_name")); // "MyGame"
console.log(db.getInt("server.port")); // 8080
db.free();

// Violating the two-tier order throws immediately, at the call that breaks it:
new MdixBuilder()
  .withTableProperties("server", JSON.stringify({ port: 8080 }))
  .withString("name", "MyApp"); // throws here — flat property after grouped data`;

  const specialTypesApi = `new MdixBuilder()
  .withLong("session_id", 9000000000n)  // bigint literal (the "n" suffix) — NOT a number
  .withHexColor("brand", "#2D6A9F")
  .withDate("release", "2025-12-31")
  .withTimestamp("created_at", "2025-01-15T10:30:00Z")
  .withBlob("icon", base64EncodedString)
  .withRegex("pattern", "^[a-z]+$")
  .withArray("tags", JSON.stringify(["web", "api"]))
  .withObject("metadata", JSON.stringify({ owner: "team-a" }))
  .withTuple("position", JSON.stringify([10, 20]))
  .toDatabase();

// No builder.toMdix()/toJson() shortcut — go through toDatabase() first,
// then use the Format Conversion page's db.toJson()/db.toMdix()/db.toToml().`;
</script>

<div class="doc-page">
  <h1>Building Programmatically</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    <code>MdixBuilder</code> enforces DixScript's two-tier
    <code>@DATA</code> rule: flat properties must be added before any
    table properties or group arrays. A violation throws immediately, at
    the call that breaks the order — not deferred to <code>toDatabase()</code>.
  </p>

  <h2>Equivalent .mdix source</h2>
  <CodeBlock code={equivalentMdix} lang="dixscript" />

  <CodeBlock code={builderApi} lang="javascript" />

  <h2>Special types</h2>
  <CodeBlock code={specialTypesApi} lang="javascript" />

  <div class="tip-callout">
    <strong>withLong takes a bigint, not a number</strong>
    <ul>
      <li>Same reasoning as <a href="#wasm-api--reading">Reading Values</a>' <code>getLong</code> — Rust's <code>i64</code> crosses the WASM boundary as a JS <code>bigint</code> on the way in too. <code>.withLong("session_id", 9000000000)</code> (a plain number) throws; <code>9000000000n</code> (the <code>n</code> suffix) is required.</li>
      <li><strong>Avoid</strong> reaching for <code>withArray</code>/<code>withObject</code> with hand-built JSON strings when a typed setter exists — <code>withTableProperties</code>/<code>withGroupArray</code> for the common table/array shapes, the specific <code>with*</code> setters for scalars. The generic JSON-string setters exist for structures the typed setters don't cover, not as a default habit.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixBuilder()',                          d: 'Create a new builder.' },
          { m: '.setConfigVersion/Author/Encoding/DebugMode(value)', d: 'Set well-known @CONFIG fields.' },
          { m: '.setConfig(key, value)',                     d: 'Set any custom @CONFIG key.' },
          { m: '.addEnum(name, fieldsJson)',                 d: '@ENUMS declaration. fieldsJson: string[] for auto-increment, or [name, value][] pairs.' },
          { m: '.withString/Int/Long/Float/Double/Bool(path, value)', d: 'Flat scalar setters. withLong takes a bigint.' },
          { m: '.withHexColor/Date/Timestamp/Blob/Regex(path, value)', d: 'Flat special-type setters, all taking a string representation.' },
          { m: '.withEnumValue(path, enumName, fieldName)',  d: 'Set a flat enum-typed field.' },
          { m: '.withArray/Object/Tuple(path, jsonString)',  d: 'Flat generic setters from a JSON string.' },
          { m: '.withTableProperties(path, jsonObjectString)', d: 'Tier-2 table block.' },
          { m: '.withGroupArray(path, jsonArrayString)',     d: 'Tier-2 group array.' },
          { m: '.toDatabase()',                               d: 'Consume the builder, produce an MdixDatabase. The only terminal method — no direct toMdix()/toJson() on the builder itself.' },
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
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
