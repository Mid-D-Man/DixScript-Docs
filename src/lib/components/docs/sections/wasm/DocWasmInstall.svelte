<!-- src/lib/components/docs/sections/wasm/DocWasmInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `npm install @midmanstudio/mdix
# or: pnpm add @midmanstudio/mdix / yarn add @midmanstudio/mdix

# Works in: Node.js, browsers (via a bundler), Vite, webpack, Rollup —
# anywhere that can load a WASM module.`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>
  <CodeBlock code={install} lang="bash" />
</div>
