<!-- src/lib/components/docs/sections/python/DocPythonOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'python-api--install',    label: 'Install',              desc: 'pip, pre-built wheels, ML extras.' },
    { id: 'python-api--quickstart', label: 'Quick Start',          desc: 'Context manager, direct load.' },
    { id: 'python-api--result',     label: 'MdixResult',           desc: 'Railway-style chaining.' },
    { id: 'python-api--loading',    label: 'Loading',              desc: 'Direct and try_* load methods.' },
    { id: 'python-api--reading',    label: 'Reading Values',       desc: 'Typed getters, try_* twins, export.' },
    { id: 'python-api--builder',    label: 'MdixBuilder',          desc: 'Fluent, chainable data construction.' },
    { id: 'python-api--merger',     label: 'MdixMerger',           desc: 'Combine sources with weighted strategies.' },
    { id: 'python-api--schema',     label: 'MdixSchemaBuilder',    desc: 'Fluent required/optional validation.' },
    { id: 'python-api--query',      label: 'Query',                desc: 'LINQ-style chaining, container protocols.' },
    { id: 'python-api--hot-reload', label: 'Hot Reload',           desc: 'Poll-based MdixWatcher.' },
    { id: 'python-api--ml-extras',  label: 'ML Extras',            desc: 'numpy / pandas / torch / tensorflow — Python-only.' },
  ];
</script>

<div class="doc-page">
  <h1>Python Runtime API</h1>
  <p class="page-lead">
    <code>midmanstudio-mdix</code> is a PyO3 binding over the Rust core,
    shipped as pre-built wheels — no Rust toolchain required. Beyond the
    core load/read/build surface, it ships <code>MdixMerger</code> and
    <code>MdixSchemaBuilder</code> (neither of which are in the package's
    own README) plus an ML-focused extras module for storing model weights,
    training history, and experiment configs directly inside
    <code>.mdix</code> files.
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
