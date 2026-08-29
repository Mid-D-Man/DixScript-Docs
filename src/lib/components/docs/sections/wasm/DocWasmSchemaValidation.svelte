<!-- src/lib/components/docs/sections/wasm/DocWasmSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
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
  <CodeBlock code={schemaApi} lang="javascript" />
</div>
