<!-- src/lib/components/docs/sections/DocIntro.svelte -->
<!-- WARNING CALLOUT STAYS ONLY HERE -->
<div class="doc-page">
  <h1>Introduction</h1>

  <div class="warn-callout">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008z"/>
    </svg>
    <span>
      DixScript is under active development and not production-ready.
      The <a href="https://github.com/Mid-D-Man/DixScript" target="_blank" rel="noopener noreferrer">C# prototype</a>
      is the current reference implementation. The Rust port is in progress.
    </span>
  </div>

  <p class="page-lead">
    DixScript (<code>.mdix</code>) is a programmable configuration format where you define patterns
    once and reuse them everywhere. It combines configuration, compile-time functions, encryption,
    and compression in a single file — with zero external dependencies.
  </p>

  <p>
    A minimal DixScript file requires only a <code>@DATA</code> section.
    Everything else is optional and additive — adopt features as you need them.
  </p>

  <h2>File Sections</h2>
  <div class="kv-table">
    {#each [
      { name: '@CONFIG',      req: false, desc: 'Compiler settings and file metadata' },
      { name: '@IMPORTS',     req: false, desc: 'Import functions and enums from other .mdix files' },
      { name: '@ENUMS',       req: false, desc: 'Named constant sets — enforced at compile time' },
      { name: '@QUICKFUNCS',  req: false, desc: 'Compile-time functions — zero runtime overhead' },
      { name: '@DATA',        req: true,  desc: 'Your configuration data — the only required section' },
      { name: '@SECURITY',    req: false, desc: 'Encryption mode and key configuration' },
      { name: '@DLM',         req: false, desc: 'Data Lifecycle Modules: compression, encryption, auditing' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.name}</code>
        <span class="kv-type">{row.req ? 'required' : 'optional'}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</div>

<script lang="ts">
  // no imports needed
</script>
