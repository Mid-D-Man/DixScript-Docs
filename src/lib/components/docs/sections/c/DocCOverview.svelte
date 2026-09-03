<!-- src/lib/components/docs/sections/c/DocCOverview.svelte -->
<script lang="ts">
  const subPages: { id: string; label: string; desc: string }[] = [
    { id: 'c-api--build-link',        label: 'Build & Link',               desc: 'CMake integration, prebuilt binaries, per-platform linking.' },
    { id: 'c-api--quickstart-c',      label: 'Quick Start (C)',            desc: 'Load, read, free — the raw handle API.' },
    { id: 'c-api--quickstart-cpp',    label: 'Quick Start (C++)',          desc: 'mdix::Database, Result<T>, RAII.' },
    { id: 'c-api--error-handling',    label: 'Error Handling & Ownership', desc: 'The NULL/false ambiguity, and who frees what.' },
    { id: 'c-api--reading',           label: 'Reading Values',             desc: 'Typed getters, type inspection, key enumeration.' },
    { id: 'c-api--encrypted',         label: 'Encrypted Loading',          desc: 'Key-file, password, and in-memory encrypted sources.' },
    { id: 'c-api--builder',           label: 'Builder API',                desc: 'Programmatic construction and round-trip editing.' },
    { id: 'c-api--query',             label: 'Query',                      desc: 'Sibling-path wildcard matching.' },
    { id: 'c-api--merging',           label: 'Merging Databases',          desc: 'Weighted AST-level merge, conflict reporting.' },
    { id: 'c-api--hot-reload',        label: 'Hot Reload',                 desc: 'Poll-based file watching via mdix::Watcher.' },
    { id: 'c-api--format-conversion', label: 'Format & Conversion',        desc: 'JSON/TOML import-export, source-text transforms.' },
  ];
</script>

<div class="doc-page">
  <h1>C / C++ Runtime API</h1>
  <p class="page-lead">
    <code>mdix-c</code> is a prebuilt native library (<code>mdix_ffi</code>)
    plus two headers: <code>mdix.h</code> — a flat C API, opaque handles,
    caller-managed memory — and <code>mdix.hpp</code>, a header-only C++17
    RAII wrapper over it (<code>Database</code>, <code>Builder</code>,
    <code>Watcher</code>, a <code>Result&lt;T&gt;</code> type). Same native
    library the Go and Odin bindings link against, distributed as a zip via
    GitHub Actions artifacts or Releases rather than a package manager.
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
