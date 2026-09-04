<!-- src/lib/components/docs/sections/java/DocJavaOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'java-api--install',           label: 'Install',                desc: 'Maven / Gradle.' },
    { id: 'java-api--quickstart',        label: 'Quick Start',            desc: 'try-with-resources, load, read, done.' },
    { id: 'java-api--facade',            label: 'DixScript Facade',       desc: 'The static entry-point class.' },
    { id: 'java-api--reading',           label: 'Reading Values',         desc: 'Typed getters with default-value overloads.' },
    { id: 'java-api--error-handling',    label: 'Error Handling',         desc: 'MdixException.' },
    { id: 'java-api--builder',           label: 'Builder API',            desc: 'Fluent, chainable data construction.' },
    { id: 'java-api--format-conversion', label: 'Format Conversion',      desc: 'JSON, TOML, .mdix, round-trip.' },
    { id: 'java-api--query',             label: 'Query',                  desc: 'Chainable MdixQuery helpers.' },
    { id: 'java-api--schema-validation', label: 'Schema Validation',      desc: 'Fluent required/optional fields.' },
    { id: 'java-api--merging',           label: 'Merging Databases',      desc: 'From sources or loaded Databases.' },
    { id: 'java-api--hot-reload',        label: 'Hot Reload',             desc: 'Manual, poll-based HotReload.' },
    { id: 'java-api--method-reference',  label: 'Full Method Reference',  desc: 'Every public method, grouped by category.' },
    { id: 'java-api--kotlin',            label: 'Kotlin',                 desc: 'Using the Java API idiomatically from Kotlin.' },
  ];
</script>

<div class="doc-page">
  <h1>Java / Kotlin Runtime API</h1>
  <p class="page-lead">
    <code>com.midmanstudio.dixscript</code> wraps the Rust core with a
    conventional Java surface — <code>Database</code> and
    <code>Builder</code> both implement <code>AutoCloseable</code>, and
    every fallible call throws <code>MdixException</code> rather than
    returning a Result type. Query, schema validation, merging, and
    file-watch-based hot reload are all here too — there's no async
    layer, which is the one real gap relative to C#.
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
