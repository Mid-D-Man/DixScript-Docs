<!-- src/lib/components/docs/sections/wasm/DocWasmInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `npm install @midmanstudio/mdix
# or: pnpm add @midmanstudio/mdix / yarn add @midmanstudio/mdix

# Works in: Node.js, browsers (via a bundler), Vite, webpack, Rollup —
# anywhere that can load a WASM module.`;

  const targetsNote = `// The package ships two different wasm-pack builds, and picks the right
// one for you automatically via package.json's export conditions — this
// is background, not something you configure:
//
//   Bundler build (webpack/Vite/Rollup, the "import" condition):
//     wasm-pack --target bundler output, which imports the compiled
//     .wasm file as a raw ES module import. Needs a bundler plugin to
//     turn that into something loadable (vite-plugin-wasm +
//     vite-plugin-top-level-await, if you're building something like
//     this docs site's own playground) — plain Node has no idea what to
//     do with a raw .wasm import and throws immediately.
//
//   Node build (the "node" condition):
//     wasm-pack --target nodejs output instead, which loads the .wasm
//     file via fs.readFileSync + WebAssembly.Instance synchronously, no
//     ESM .wasm import involved. This is what a plain
//     \`node script.mjs\` with no bundler in the loop actually needs, and
//     what running \`import ... from "@midmanstudio/mdix"\` under Node
//     resolves to.
//
// Same exported symbols either way — this only matters if you're
// debugging a build error that mentions wasm-pkg vs wasm-pkg-node, or
// writing a custom bundler config from scratch.`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>
  <CodeBlock code={install} lang="bash" />

  <h2>Two builds under the hood</h2>
  <CodeBlock code={targetsNote} lang="javascript" />
</div>
