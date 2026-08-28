<!-- src/lib/components/docs/sections/DocWasmApi.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `npm install @midmanstudio/mdix
# or: pnpm add @midmanstudio/mdix / yarn add @midmanstudio/mdix

# Works in: Node.js, browsers (via a bundler), Vite, webpack, Rollup —
# anywhere that can load a WASM module.`;

  const quickStart = `import { MdixDatabase, MdixBuilder, tryGet } from "@midmanstudio/mdix";

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

  const resultPattern = `import { tryGet, tryGetAsync, unwrap, unwrapOr } from "@midmanstudio/mdix";

// tryGet wraps a throwing call into { ok: true, value } | { ok: false, error }
const port = tryGet(() => db.getInt("port"));

// unwrapOr — fallback value instead of a branch
const timeout = unwrapOr(tryGet(() => db.getInt("timeout")), 30000);

// unwrap — throws the original error if the result was a failure
// (mostly useful when you've already checked .ok elsewhere)
const host = unwrap(tryGet(() => db.getString("server.host")));

// tryGetAsync — same pattern for anything that returns a Promise
const remote = await tryGetAsync(async () => fetchAndLoad("config.mdix"));`;

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

  const converterApi = `import { MdixDatabase } from "@midmanstudio/mdix";

// Import from foreign formats
const fromJson = MdixDatabase.fromJson(JSON.stringify({ port: 8080 }));
const fromToml = MdixDatabase.fromToml("port = 8080\\n");

// Export (also available as instance methods on any MdixDatabase — see Read API)
const json = fromJson.toJson(true);
const toml = fromJson.toToml();
const mdix = fromJson.toMdix();`;

  const queryApi = `import { query, queryMany } from "@midmanstudio/mdix";

// Unlike the other bindings, this is NOT a chainable Query object — it's
// a plain typed array. Use native Array methods on the result directly.
interface Enemy { name: string; hp: number; }

const boss = query<Enemy>(db, "enemies")
  .filter(e => e.hp > 100)              // where_
  .sort((a, b) => b.hp - a.hp)[0];      // order_by_desc + first

const names = query<Enemy>(db, "enemies").map(e => e.name);   // select
const total = query<Enemy>(db, "enemies")
  .reduce((sum, e) => sum + e.hp, 0);    // sum_int

// queryMany — whole-segment glob across sibling paths ("*" only), same
// pattern syntax as the core's select_many
const statuses = queryMany<string>(db, "servers.*.status");

// Returns [] for a path that doesn't exist or isn't array-shaped —
// that's a normal "no match", not an error.`;

  const mergeApi = `import { mergeSources, mergeSourcesWeighted } from "@midmanstudio/mdix";

// Sources are weighted in descending order by position — sources[0]
// gets weight 1.0, the last gets the lowest weight (only matters under
// the "weighted" strategy, the default).
const outcome = mergeSources(
  [sourceA, sourceB],
  "primary_wins",    // "weighted" | "primary_wins" | "secondary_wins" | "throw_on_conflict"
  "concat_dedup",     // "replace" | "concat" | "concat_dedup" — array-shaped values
);
const merged = outcome.database();      // MdixDatabase — free() it when done
const conflicts = outcome.conflicts();  // array of { path, winningSource, winningLabel }

// Explicit [source, weight] pairs instead of positional weighting
const weighted = mergeSourcesWeighted([[sourceA, 1.0], [sourceB, 0.5]]);

// Merge into an already-loaded database instead of raw source strings
const combined = db.mergeWith(otherDb, "primary_wins", "concat_dedup");`;

  const schemaApi = `import { MdixSchema } from "@midmanstudio/mdix";

const schema = new MdixSchema()
  .requireString("app_name")
  .requireInt("port")
  .optionalBool("debug")
  .withDescription("basic app config");

schema.fieldCount;   // getter -> number of declared fields
schema.paths();       // string[]

const report = db.validateSchema(schema);
report.isValid;        // getter -> boolean
report.errorCount;     // getter -> number
report.failedPaths();  // string[]
report.errors();        // array of { path, expected, actual, kind }`;

  const watchApi = `import { MdixWatcher } from "@midmanstudio/mdix";

// No filesystem in wasm32-unknown-unknown at all — not a restricted
// one, none — so this can't be a path-watcher like the Python/Go/Java
// bindings. Instead it's a content-hash change detector: YOU already
// know when your source changed (Node's fs.watch, or a browser polling
// its own fetch()) — this just decides cheaply whether newly-read text
// actually differs before paying for a re-parse.
const watcher = new MdixWatcher();

// Node — fs.watch tells you WHEN; this decides WHETHER to re-parse:
fs.watch("config.mdix", async () => {
  const text = await fs.promises.readFile("config.mdix", "utf8");
  const outcome = watcher.check(text);
  if (outcome.changed) applyNewConfig(outcome.database());
});

// Browser — poll your own source:
setInterval(async () => {
  const text = await (await fetch("/config.mdix")).text();
  const outcome = watcher.check(text);
  if (outcome.changed) applyNewConfig(outcome.database());
}, 5000);

// hasChanged() — cheap pre-check by hash only, doesn't parse or update state
watcher.hasChanged(someText);

// reset() — forget previously seen content; the next check() always
// reports changed = true regardless of whether the content matches
watcher.reset();`;
</script>

<div class="doc-page">
  <h1>WebAssembly / JavaScript Runtime API</h1>
  <p class="page-lead">
    <code>@midmanstudio/mdix</code> is the published npm package — a thin,
    typed wrapper around <code>mdix-wasm</code>, the Rust crate compiled to
    WebAssembly via <code>wasm-bindgen</code>. Works in Node.js, the browser,
    and any bundler that handles WASM (Vite, webpack, Rollup). Merge,
    schema validation, and hot-reload support are all published too, not
    just the database/builder core.
  </p>

  <h2>Install</h2>
  <CodeBlock code={install} lang="bash" />

  <h2>Quick Start</h2>
  <CodeBlock code={quickStart} lang="javascript" />

  <h2>Reading Values</h2>
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

  <h2>The Result Pattern</h2>
  <p>
    Every getter throws on failure by default. Wrap calls in
    <code>tryGet</code> for a <code>{'{ ok, value }'} | {'{ ok, error }'}</code>
    result instead — no try/catch needed at the call site.
  </p>
  <CodeBlock code={resultPattern} lang="javascript" />

  <h2>Building Programmatically</h2>
  <p>
    <code>MdixBuilder</code> enforces DixScript's two-tier
    <code>@DATA</code> rule: flat properties must be added before any
    table properties or group arrays. A violation throws immediately, at
    the call that breaks the order — not deferred to <code>toDatabase()</code>.
  </p>
  <CodeBlock code={builderApi} lang="javascript" />

  <h2>Format Conversion</h2>
  <CodeBlock code={converterApi} lang="javascript" />

  <h2>Query</h2>
  <p>
    Deliberately not a chainable query object — <code>query()</code> and
    <code>queryMany()</code> just parse the native side's JSON output into
    a plain typed array, and hand it back to you. Use ordinary
    <code>Array</code> methods (<code>.filter</code>, <code>.sort</code>,
    <code>.map</code>, <code>.reduce</code>) instead of a bespoke chain API.
  </p>
  <CodeBlock code={queryApi} lang="javascript" />

  <h2>Merging Databases</h2>
  <p>
    AST-level merge — no JSON round-trip, so every DixScript type
    survives the merge exactly. Works from raw source strings
    (<code>mergeSources</code>) or from an already-loaded database
    (<code>db.mergeWith(other, ...)</code>).
  </p>
  <CodeBlock code={mergeApi} lang="javascript" />

  <h2>Schema Validation</h2>
  <p>
    <code>MdixSchema</code> — fluent required/optional field declarations,
    checked via <code>db.validateSchema(schema)</code>.
  </p>
  <CodeBlock code={schemaApi} lang="javascript" />

  <h2>Hot Reload — Content-Hash Watching</h2>
  <p>
    A fundamentally different design from the other bindings' file
    watchers, and deliberately so: <code>wasm32-unknown-unknown</code>
    has no filesystem access at all, in the browser or in Node, so an
    mtime-polling watcher like Python's or Go's simply cannot exist here.
    <code>MdixWatcher</code> instead hashes whatever text you feed it and
    tells you cheaply whether it actually changed since last time — the
    host (Node's <code>fs.watch</code>, or your own <code>fetch()</code>
    poll) still owns knowing *when* to check.
  </p>
  <CodeBlock code={watchApi} lang="javascript" />
</div>
