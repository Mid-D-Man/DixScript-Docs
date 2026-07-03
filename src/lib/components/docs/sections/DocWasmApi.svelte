<!-- src/lib/components/docs/sections/DocWasmApi.svelte -->
<script lang="ts">
  const install = `npm install @dixscript/core
# or: pnpm add @dixscript/core / yarn add @dixscript/core

# Works in: Node.js, browsers (via a bundler), Vite, webpack, Rollup —
# anywhere that can load a WASM module.`;

  const quickStart = `import { MdixDatabase, MdixBuilder, tryGet } from "@dixscript/core";

// Load from a .mdix source string
const db = MdixDatabase.loadStr(\`
  @DATA(
    app_name = "MyApp"
    port     = 8080
    ssl      = true
  )
\`);

// Direct access — throws on error
const name = db.getString("app_name"); // "MyApp"
const port = db.getInt("port");        // 8080

// Safe access — returns MdixResult<T>, never throws
const result = tryGet(() => db.getString("missing_key"));
if (result.ok) console.log(result.value);
else           console.error(result.error);

db.free(); // WASM memory is not GC'd — always free() when done`;

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

  const resultPattern = `import { tryGet, tryGetAsync, unwrap, unwrapOr } from "@dixscript/core";

// tryGet wraps a throwing call into { ok: true, value } | { ok: false, error }
const port = tryGet(() => db.getInt("port"));

// unwrapOr — fallback value instead of a branch
const timeout = unwrapOr(tryGet(() => db.getInt("timeout")), 30000);

// unwrap — throws the original error if the result was a failure
// (mostly useful when you've already checked .ok elsewhere)
const host = unwrap(tryGet(() => db.getString("server.host")));

// tryGetAsync — same pattern for anything that returns a Promise
const remote = await tryGetAsync(async () => fetchAndLoad("config.mdix"));`;

  const builderApi = `import { MdixBuilder } from "@dixscript/core";

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

  const converterApi = `import { MdixDatabase } from "@dixscript/core";

// Import from foreign formats
const fromJson = MdixDatabase.fromJson(JSON.stringify({ port: 8080 }));
const fromToml = MdixDatabase.fromToml("port = 8080\\n");

// Export (also available as instance methods on any MdixDatabase — see Read API)
const json = fromJson.toJson(true);
const toml = fromJson.toToml();
const mdix = fromJson.toMdix();`;

  const cratePreview = `// ⚠️ NOT yet re-exported from @dixscript/core's src/index.ts.
// These exist and work in the mdix-wasm crate today — if you need them
// before the npm package catches up, re-export them yourself from the
// compiled wasm-pkg, or build mdix-wasm locally with wasm-pack.

// --- Merge — combine multiple .mdix sources ---
import { mergeSources, mergeSourcesWeighted, mergeWith } from "../wasm-pkg/mdix_wasm.js";

const merged = mergeSources([sourceA, sourceB], "primary_wins");
const db = merged.database();          // MdixDatabase
const conflicts = merged.conflicts();  // JsValue — array of conflict records

// weighted variant — [(source, weight), ...], higher weight wins ties
const weighted = mergeSourcesWeighted([[sourceA, 1.0], [sourceB, 0.5]]);

// --- Schema — fluent validation against a loaded database ---
import { MdixSchema } from "../wasm-pkg/mdix_wasm.js";

const schema = new MdixSchema()
  .requireString("app_name")
  .requireInt("port")
  .optionalBool("debug")
  .withDescription("basic app config");

console.log(schema.fieldCount());   // number of declared fields
console.log(schema.paths());        // string[]

const report = schema.validate(db); // hypothetical validate() call shape —
                                     // check mdix-wasm/src/schema.rs for the
                                     // exact current method name before relying on it
console.log(report.isValid());
console.log(report.errorCount());
console.log(report.failedPaths());

// --- Watch — detect source changes for hot-reload workflows ---
import { MdixWatcher } from "../wasm-pkg/mdix_wasm.js";

const watcher = new MdixWatcher();
if (watcher.hasChanged(newSourceText)) {
  const outcome = watcher.check(newSourceText);
  if (outcome.changed()) {
    const freshDb = outcome.database();
  }
}`;
</script>

<div class="doc-page">
  <h1>WebAssembly / JavaScript Runtime API</h1>
  <p class="page-lead">
    <code>@dixscript/core</code> is the published npm package — a thin,
    typed wrapper around <code>mdix-wasm</code>, the Rust crate compiled to
    WebAssembly via <code>wasm-bindgen</code>. Works in Node.js, the browser,
    and any bundler that handles WASM (Vite, webpack, Rollup).
  </p>

  <div class="callout">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
    </svg>
    <span>
      The npm package currently exposes a subset of what the underlying
      <code>mdix-wasm</code> crate can do — see
      <a href="#crate-gap">Merge, Schema &amp; Watch</a> below for the parts
      that exist in the crate but aren't re-exported from
      <code>src/index.ts</code> yet.
    </span>
  </div>

  <h2>Install</h2>
  <pre><code>{install}</code></pre>

  <h2>Quick Start</h2>
  <pre><code>{quickStart}</code></pre>

  <h2>Reading Values</h2>
  <pre><code>{readApi}</code></pre>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'MdixDatabase.loadStr(source)',     d: 'Compile and load DixScript source from a string. No file I/O.' },
          { m: 'MdixDatabase.fromJson(json)',      d: 'Load from a raw JSON string.' },
          { m: 'MdixDatabase.fromToml(toml)',      d: 'Load from a raw TOML string.' },
          { m: 'db.free()',                        d: 'Release the WASM-side memory. WASM objects are not garbage collected — call this when you\'re done with a database or builder.' },
          { m: 'db.isValid',                       d: 'Getter — whether the handle is still valid (false after free()).' },
          { m: 'db.entryCount',                    d: 'Getter — total entries in the flattened store.' },
          { m: 'db.getValueType(path)',            d: 'Returns the type name at a path as a string, e.g. "int", "object".' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>The Result Pattern</h2>
  <p>
    Every WASM method throws a <code>JsValue</code> on failure by default —
    idiomatic for JS/TS call sites that already use try/catch. Import
    <code>tryGet</code> if you'd rather branch on a result object than catch
    exceptions.
  </p>
  <pre><code>{resultPattern}</code></pre>

  <h2>Building Programmatically</h2>
  <p>
    <code>MdixBuilder</code> enforces DixScript's two-tier <code>@DATA</code>
    rule: flat properties must be added before any table properties or group
    arrays. A violation throws immediately, at the call that broke the order
    — not at <code>.toDatabase()</code>.
  </p>
  <pre><code>{builderApi}</code></pre>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixBuilder()',                         d: 'Create a builder.' },
          { m: '.setConfigVersion / Author / Encoding(v)',  d: '@CONFIG entries.' },
          { m: '.addEnum(name, fieldsJson)',                d: '@ENUMS declaration — fields as a JSON array string.' },
          { m: '.withString/Int/Long/Float/Double/Bool(path, v)', d: 'Tier-1 flat properties.' },
          { m: '.withHexColor/Date/Timestamp/Blob/Regex(path, v)', d: 'Tier-1 flat properties, special types.' },
          { m: '.withEnumValue(path, enumName, field)',     d: 'Tier-1 flat enum reference.' },
          { m: '.withArray/Object/Tuple(path, itemsJson)',  d: 'Tier-1 flat structured values as JSON strings.' },
          { m: '.withTableProperties(path, propsJson)',     d: 'Tier-2 table block. Must come after all tier-1 calls.' },
          { m: '.withGroupArray(path, itemsJson)',          d: 'Tier-2 group array. Must come after all tier-1 calls.' },
          { m: '.serialize()',                              d: 'Returns the .mdix source string without loading it.' },
          { m: '.toDatabase()',                             d: 'Consumes the builder, returns a loaded MdixDatabase.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Format Conversion</h2>
  <pre><code>{converterApi}</code></pre>

  <h2 id="crate-gap">Beyond the npm package: Merge, Schema &amp; Watch</h2>
  <p>
    <code>mdix-wasm</code> — the Rust crate the npm package is compiled
    from — already implements three features that
    <code>@dixscript/core</code> doesn't publish yet: multi-source merging,
    fluent schema validation, and a source-change watcher for hot-reload
    tooling. The Rust source below is real (<code>merge.rs</code>,
    <code>schema.rs</code>, <code>watch.rs</code>); the JS call shapes are
    the exported <code>#[wasm_bindgen]</code> signatures, but treat the
    exact method names as provisional until they're wired into
    <code>src/index.ts</code> and published.
  </p>
  <pre><code>{cratePreview}</code></pre>

  <p>
    If your project needs these today, the fastest path is building
    <code>mdix-wasm</code> yourself with <code>wasm-pack build</code> and
    importing straight from the generated <code>wasm-pkg</code> — the same
    module the npm package re-exports from — rather than waiting on a
    published re-export.
  </p>
</div>

<style>
  .callout {
    display: flex;
    gap: 0.625rem;
    align-items: flex-start;
    padding: 0.75rem 0.875rem;
    border: 1px solid rgba(234, 179, 8, 0.35);
    background: rgba(234, 179, 8, 0.08);
    border-radius: var(--radius);
    font-size: 0.8125rem;
    color: var(--foreground);
    margin: 1rem 0 1.5rem;
  }
  .callout svg { flex-shrink: 0; margin-top: 0.1rem; color: #eab308; }
  .callout a { color: var(--primary); }
</style>
