<!-- src/lib/components/docs/sections/wasm/DocWasmOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'wasm-api--install',           label: 'Install',                desc: 'npm/pnpm/yarn, bundler requirements.' },
    { id: 'wasm-api--quickstart',        label: 'Quick Start',            desc: 'Load, read, done.' },
    { id: 'wasm-api--reading',           label: 'Reading Values',         desc: 'Typed getters, throw-by-default.' },
    { id: 'wasm-api--result-pattern',    label: 'The Result Pattern',     desc: 'tryGet — no try/catch needed.' },
    { id: 'wasm-api--builder',           label: 'Building Programmatically', desc: 'Two-tier @DATA rule enforced immediately.' },
    { id: 'wasm-api--format-conversion', label: 'Format Conversion',      desc: 'JSON, TOML, .mdix.' },
    { id: 'wasm-api--query',             label: 'Query',                  desc: 'Plain arrays, not chainable — native Array methods.' },
    { id: 'wasm-api--merging',           label: 'Merging Databases',      desc: 'AST-level merge, weighted strategies.' },
    { id: 'wasm-api--schema-validation', label: 'Schema Validation',      desc: 'Fluent required/optional fields.' },
    { id: 'wasm-api--hot-reload',        label: 'Hot Reload',             desc: 'Content-hash watching — no filesystem in wasm32.' },
    { id: 'wasm-api--dlm',               label: 'DLM (Compress/Encrypt/Audit)', desc: 'In-memory compile/decompile, audit trail via localStorage.' },
    { id: 'wasm-api--cloud-imports',     label: 'Cloud Imports',          desc: 'prefetchImport — bridging @IMPORTS from_cloud into wasm32.' },
    { id: 'wasm-api--method-reference',  label: 'Full Method Reference',  desc: 'Every exported JS method, grouped by category.' },
  ];
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

  <h2>On this page</h2>
  <div class="subpage-grid">
    {#each subPages as p}
      <a href="#{p.id}" class="subpage-card">
        <span class="subpage-label">{p.label}</span>
        <span class="subpage-desc">{p.desc}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .subpage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }
  .subpage-card {
    display: flex; flex-direction: column; gap: 0.25rem;
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 0.875rem; text-decoration: none; transition: border-color 0.15s;
  }
  .subpage-card:hover { border-color: var(--primary); }
  .subpage-label { font-size: 0.875rem; font-weight: 700; color: var(--foreground); }
  .subpage-desc  { font-size: 0.78125rem; color: var(--muted-foreground); line-height: 1.5; }
</style>
