<!-- src/lib/components/docs/sections/odin/DocOdinOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'odin-api--build-link',      label: 'Build & Link',           desc: 'Building mdix_ffi and linking against it.' },
    { id: 'odin-api--quickstart',      label: 'Quick Start',            desc: 'Load, read, done.' },
    { id: 'odin-api--value-ok',        label: 'The (value, ok) Pattern', desc: 'No exceptions, caller-owned allocation.' },
    { id: 'odin-api--loading',         label: 'Loading',                desc: 'File, string, encrypted, JSON, TOML.' },
    { id: 'odin-api--reading',         label: 'Reading Values',         desc: 'Typed getters, wildcard queries, introspection.' },
    { id: 'odin-api--export',          label: 'Export & Source Transforms', desc: 'JSON/TOML/.mdix, format/minify/compact.' },
    { id: 'odin-api--builder',         label: 'Building Programmatically', desc: 'Full builder_* procedure set.' },
    { id: 'odin-api--query',           label: 'Query — Typed, Chainable', desc: 'Generic Query(T).' },
    { id: 'odin-api--schema',          label: 'Schema Validation',      desc: 'schema_* required/optional fields.' },
    { id: 'odin-api--merging',         label: 'Merging Databases',      desc: 'AST-level merge, weighted strategies.' },
    { id: 'odin-api--hot-reload',      label: 'Hot Reload',             desc: 'Per-frame-loop-friendly, no background thread.' },
    { id: 'odin-api--vs-c',            label: 'vs the raw C API',       desc: 'What the wrapper buys you over mdix.h directly.' },
  ];
</script>

<div class="doc-page">
  <h1>Odin Runtime API</h1>
  <p class="page-lead">
    <code>mdix-odin</code> wraps the same <code>mdix_ffi</code> native
    library used by the C/C++ and Go bindings. It has the broadest raw
    surface of any wrapper — every read, every builder call, wildcard
    queries, source transforms, merge, schema validation, and hot reload
    are all exposed directly, following Odin's idiomatic
    <code>(value, ok)</code> convention instead of exceptions or a Result
    type.
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
