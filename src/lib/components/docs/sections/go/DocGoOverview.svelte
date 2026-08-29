<!-- src/lib/components/docs/sections/go/DocGoOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'go-api--install',           label: 'Install',                desc: 'go get, CGO requirements, native lib setup.' },
    { id: 'go-api--quickstart',        label: 'Quick Start',            desc: 'Load, read, done.' },
    { id: 'go-api--loading',           label: 'Loading',                desc: 'File, string, encrypted, JSON, TOML.' },
    { id: 'go-api--reading',           label: 'Reading Values',         desc: 'Typed getters, special types, enums, introspection.' },
    { id: 'go-api--error-handling',    label: 'Error Handling',         desc: '(value, error) + *MdixError.Kind.' },
    { id: 'go-api--builder',           label: 'Builder API',            desc: 'Build data programmatically.' },
    { id: 'go-api--format-conversion', label: 'Format Conversion',      desc: 'JSON, TOML, .mdix, in both directions.' },
    { id: 'go-api--query',             label: 'Query',                  desc: 'Generic LINQ-style Query[T] helpers.' },
    { id: 'go-api--schema-validation', label: 'Schema Validation',      desc: 'Fluent required/optional field validation.' },
    { id: 'go-api--merging',           label: 'Merging Databases',      desc: 'AST-level merge with weighted strategies.' },
    { id: 'go-api--hot-reload',        label: 'Hot Reload',             desc: 'Poll-based file watching.' },
    { id: 'go-api--package-layout',    label: 'Package Layout',         desc: 'What lives in each file.' },
    { id: 'go-api--vs-csharp',         label: 'vs C#',                  desc: 'Concept mapping between the two most complete bindings.' },
  ];
</script>

<div class="doc-page">
  <h1>Go Runtime API</h1>
  <p class="page-lead">
    <code>github.com/Mid-D-Man/dixscript-go</code> wraps the Rust core via
    cgo, exposing idiomatic Go <code>(value, error)</code> returns
    throughout — no exceptions, no Result wrapper type, just standard Go
    error handling.
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
