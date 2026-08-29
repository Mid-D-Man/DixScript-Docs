<!-- src/lib/components/docs/sections/wasm/DocWasmQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
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
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>
  <CodeBlock code={quickStart} lang="javascript" />
</div>
