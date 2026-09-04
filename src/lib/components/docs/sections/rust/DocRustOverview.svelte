<!-- src/lib/components/docs/sections/rust/DocRustOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'rust-api--loader',           label: 'Loading Files',     desc: 'DixLoader — plain, string, and encrypted sources.' },
    { id: 'rust-api--loader-options',   label: 'Loader Options',    desc: 'DixLoadOptions — passwords, key files, key URLs.' },
    { id: 'rust-api--query',            label: 'Querying Data',     desc: 'DixData, typed get<T>, wildcard select_many, DixValue.' },
    { id: 'rust-api--builder',          label: 'Builder API',       desc: 'DixDataBuilder — build DixData in memory, two-tier rules.' },
    { id: 'rust-api--format-conversion',label: 'Format Conversion', desc: 'DixConverter, DixFormatOptions, DixCompactor.' },
    { id: 'rust-api--schema-validation',label: 'Schema Validation', desc: 'SchemaBuilder — fluent require_*/optional_* validation.' },
    { id: 'rust-api--merging',          label: 'Merging Databases', desc: 'MdixMerger — AST-level merge, weighted/priority strategies.' },
    { id: 'rust-api--serde',            label: 'Serde Support',     desc: 'DixSerialize / DixDeserialize for your own structs.' },
    { id: 'rust-api--hot-reload',       label: 'Hot Reload',        desc: 'HotReloadWatcher — poll-based, no OS event dependency.' },
    { id: 'rust-api--method-reference', label: 'Full Method Reference', desc: 'Every public item, grouped by category.' },
  ];
</script>

<div class="doc-page">
  <h1>Rust Runtime API</h1>
  <p class="page-lead">
    The <code>dixscript</code> crate exposes a pure-Rust API for loading, querying,
    building, and converting DixScript data at runtime. The main entry points are
    <code>DixLoader</code> (loading files), <code>DixData</code> (querying data),
    <code>DixDataBuilder</code> (creating data programmatically), and
    <code>DixConverter</code> (format conversion). All types live in the
    <code>dixscript::Runtime</code> module.
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
