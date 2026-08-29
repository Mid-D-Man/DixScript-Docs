<!-- src/lib/components/docs/sections/wasm/DocWasmFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const converterApi = `import { MdixDatabase } from "@midmanstudio/mdix";

// Import from foreign formats
const fromJson = MdixDatabase.fromJson(JSON.stringify({ port: 8080 }));
const fromToml = MdixDatabase.fromToml("port = 8080\\n");

// Export (also available as instance methods on any MdixDatabase — see Reading Values)
const json = fromJson.toJson(true);
const toml = fromJson.toToml();
const mdix = fromJson.toMdix();`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>
  <CodeBlock code={converterApi} lang="javascript" />
</div>
