<!-- src/lib/components/docs/sections/wasm/DocWasmSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  port<int> = 8080
)

// Missing 'debug' is fine (optional below). A file missing 'app_name'
// or 'port' entirely would fail validation even though the compiler
// accepts it just fine — the compiler only enforces types annotated in
// the source, not "this field must exist at all".`;

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
</script>

<div class="doc-page">
  <h1>Schema Validation</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    <code>MdixSchema</code> — fluent required/optional field declarations,
    checked via <code>db.validateSchema(schema)</code>.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={schemaApi} lang="javascript" />

  <div class="tip-callout">
    <strong>Schema vs the DixScript compiler</strong>
    <ul>
      <li><strong>Use <code>MdixSchema</code></strong> for constraints the compiler can't express — "this field must exist," not just "if present, it must be this type."</li>
      <li><strong>Validate immediately after loading</strong>, before anything else reads from the database — one check at the boundary means the rest of your code can trust the shape instead of defensively checking <code>exists()</code> everywhere.</li>
      <li><strong>Free the schema when you're done with it</strong> — <code>schema.free()</code> exists, same as <code>MdixDatabase</code>/<code>MdixBuilder</code>. Unlike those two, it's wasm-bindgen's plain auto-generated default rather than a hand-written one with extra guard logic — functionally the same obligation, just worth knowing if you're ever diffing behavior between types in this package.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixSchema()',                                        d: 'Create a new schema.' },
          { m: '.requireString/Int/Long/Float/Double/Bool/Array/Object/Enum(path)', d: 'Declare a required field, typed.' },
          { m: '.optionalString/Int/Long/Float/Double/Bool/Array/Object(path)', d: 'Declare an optional field, typed.' },
          { m: '.withDescription(text)',   d: 'Attach a description for tooling/error output.' },
          { m: 'schema.fieldCount',         d: 'getter -> number of declared fields.' },
          { m: 'schema.paths()',            d: 'string[] — every declared path.' },
          { m: 'db.validateSchema(schema)', d: 'Run validation, returns MdixValidationReport.' },
          { m: 'report.isValid',            d: 'getter -> boolean.' },
          { m: 'report.errorCount',         d: 'getter -> number.' },
          { m: 'report.failedPaths()',      d: 'string[].' },
          { m: 'report.errors()',           d: 'Array of { path, expected, actual, kind }.' },
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
