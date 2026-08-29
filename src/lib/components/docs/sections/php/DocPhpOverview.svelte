<!-- src/lib/components/docs/sections/php/DocPhpOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'php-api--install',           label: 'Install',                desc: 'Composer + the native library build step.' },
    { id: 'php-api--quickstart',        label: 'Quick Start',            desc: 'Load, read, done.' },
    { id: 'php-api--loading',           label: 'Loading',                desc: 'Direct and railway (try*) load methods.' },
    { id: 'php-api--reading',           label: 'Reading Values',         desc: 'Typed getters, try* twins, export.' },
    { id: 'php-api--error-handling',    label: 'Error Handling',         desc: 'MdixError and ErrorKind.' },
    { id: 'php-api--result',            label: 'MdixResult',             desc: 'Railway-style chaining combinators.' },
    { id: 'php-api--builder',           label: 'Builder API',            desc: 'Fluent, chainable data construction.' },
    { id: 'php-api--format-conversion', label: 'Format Conversion',      desc: 'JSON, TOML, .mdix, round-trip.' },
    { id: 'php-api--types',             label: 'Types',                  desc: 'ValueType and FormatMode enums.' },
    { id: 'php-api--lifecycle',         label: 'Lifecycle & Cleanup',    desc: 'Native handle management.' },
  ];
</script>

<div class="doc-page">
  <h1>PHP Runtime API</h1>
  <p class="page-lead">
    <code>midmanstudio/mdix</code> binds to the Rust core through PHP's FFI
    extension. Like Python, every method has both a throw-on-failure form
    and a <code>try*()</code> twin returning <code>MdixResult</code> for
    railway-style chaining — pick whichever fits the call site.
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
