<!-- src/lib/components/docs/sections/csharp/DocCSharpOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'csharp-api--install',           label: 'Install',                desc: 'NuGet package reference.' },
    { id: 'csharp-api--quickstart',        label: 'Quick Start',            desc: 'The Dix static facade — load, read, done.' },
    { id: 'csharp-api--error-handling',    label: 'Error Handling',         desc: 'MdixResult<T> — success/failure without exceptions.' },
    { id: 'csharp-api--loading',           label: 'Loading Data',           desc: 'Sync, async, encrypted, foreign formats, hot reload.' },
    { id: 'csharp-api--reading',           label: 'Reading Values',         desc: 'Typed getters, special types, enums, collections.' },
    { id: 'csharp-api--query',             label: 'Query API',              desc: 'LINQ-style filtering/projection over group arrays.' },
    { id: 'csharp-api--dynamic-access',    label: 'Dynamic Access',         desc: 'MdixDynamic — exploratory reads without a POCO.' },
    { id: 'csharp-api--poco',              label: 'POCO Deserialization',   desc: 'Deserialize a prefix straight into your own class.' },
    { id: 'csharp-api--enum-codegen',       label: 'Enum Code Generation',   desc: 'Generate real, type-safe C# enums from @ENUMS.' },
    { id: 'csharp-api--builder',           label: 'Builder API',            desc: 'MdixBuilder — build data programmatically, fluently.' },
    { id: 'csharp-api--merging',           label: 'Merging Databases',      desc: 'Combine two or more databases with a merge strategy.' },
    { id: 'csharp-api--schema-validation', label: 'Schema Validation',      desc: 'MdixSchemaBuilder — declarative required/optional fields.' },
    { id: 'csharp-api--format-conversion', label: 'Format Conversion',      desc: '.mdix, JSON, and TOML, in both directions.' },
    { id: 'csharp-api--method-reference',  label: 'Full Method Reference',  desc: 'Every Dix facade method, grouped by category.' },
  ];
</script>

<div class="doc-page">
  <h1>C# / Unity Runtime API</h1>
  <p class="page-lead">
    <code>MidManStudio.Mdix</code> is the most complete language binding —
    it was the original reference implementation before the Rust port, and
    the C# wrapper around the Rust core has grown well past a thin FFI
    shim: LINQ-style queries, dynamic access, POCO (de)serialization,
    schema validation, database merging, hot reload, and a full async
    surface are all here. Published on NuGet.
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
