<!-- src/lib/components/docs/DocLayout.svelte -->
<script lang="ts">
  export let sidebarOpen = false;
</script>

<div class="docs-layout">

  {#if sidebarOpen}
    <div
      class="backdrop"
      on:click={() => (sidebarOpen = false)}
      role="presentation"
    ></div>
  {/if}

  <aside class="sidebar-panel" class:open={sidebarOpen}>
    <slot name="sidebar" />
  </aside>

  <div class="docs-main">
    <!-- Mobile-only top bar — lives INSIDE content, not above nav -->
    <div class="mobile-bar">
      <button
        class="menu-btn"
        on:click={() => (sidebarOpen = true)}
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
      </button>
      <span class="mobile-label">Documentation</span>
    </div>

    <div class="page-body">
      <slot />
    </div>
  </div>
</div>

<style>
  .docs-layout {
    display: flex;
    min-height: calc(100vh - 4rem);
    position: relative;
    align-items: flex-start;
  }

  /* ── Backdrop ── */
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 98;
  }

  /* ── Sidebar panel ── */
  .sidebar-panel {
    width: 260px;
    flex-shrink: 0;
    position: sticky;
    top: 4rem;
    height: calc(100vh - 4rem);
    overflow-y: auto;
    border-right: 1px solid var(--border);
    background: var(--background);
    transition: background 0.3s ease;
    z-index: 99;
  }

  /* ── Main content ── */
  .docs-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .mobile-bar {
    display: none;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--background);
  }

  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--foreground);
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .menu-btn:hover { background: var(--muted); }

  .mobile-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .page-body {
    padding: 2.5rem 3rem;
    max-width: 820px;
  }

  /* ── Mobile ── */
  @media (max-width: 900px) {
    .mobile-bar { display: flex; }

    .sidebar-panel {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      box-shadow: 4px 0 32px rgba(0, 0, 0, 0.18);
    }

    .sidebar-panel.open {
      transform: translateX(0);
    }

    .page-body {
      padding: 1.5rem 1rem;
    }
  }

  /* ══════════════════════════════════════════════
     Global doc-page styles
     Used by all section components via .doc-page
  ══════════════════════════════════════════════ */

  :global(.doc-page) { max-width: 760px; }

  :global(.doc-page h1) {
    font-family: var(--font-serif);
    font-size: clamp(1.625rem, 3vw, 2.125rem);
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border);
    line-height: 1.25;
  }

  :global(.doc-page .page-lead) {
    font-size: 1rem;
    color: var(--muted-foreground);
    line-height: 1.8;
    margin-bottom: 2rem;
    max-width: 640px;
  }

  :global(.doc-page h2) {
    font-family: var(--font-serif);
    font-size: 1.1875rem;
    font-weight: 700;
    color: var(--primary);
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid var(--border);
  }

  :global(.doc-page h3) {
    font-family: var(--font-serif);
    font-size: 1rem;
    font-weight: 700;
    color: var(--foreground);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  :global(.doc-page p) {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  :global(.doc-page strong) { color: var(--foreground); font-weight: 600; }

  :global(.doc-page a) {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.15s;
  }
  :global(.doc-page a:hover) { opacity: 0.75; }

  :global(.doc-page pre) {
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.125rem;
    overflow-x: auto;
    font-size: 0.8125rem;
    line-height: 1.75;
    margin: 0.875rem 0 1.5rem;
    color: var(--foreground);
  }

  :global(.doc-page pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: inherit;
  }

  :global(.doc-page code) {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 6px;
    color: var(--foreground);
  }

  :global(.doc-page ul),
  :global(.doc-page ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  :global(.doc-page li) {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.7;
  }

  /* Callout — only used in DocIntro */
  :global(.doc-page .warn-callout) {
    background: rgba(181, 74, 53, 0.06);
    border: 1px solid rgba(181, 74, 53, 0.2);
    border-left: 3px solid var(--destructive);
    border-radius: 6px;
    padding: 0.875rem 1rem;
    margin: 0 0 1.75rem;
    font-size: 0.875rem;
    line-height: 1.75;
    color: var(--foreground);
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }
  :global(.doc-page .warn-callout svg) {
    color: var(--destructive);
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* KV table */
  :global(.doc-page .kv-table) {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin: 0.875rem 0 1.5rem;
  }

  :global(.doc-page .kv-row) {
    display: grid;
    grid-template-columns: 200px 72px 1fr;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--border);
    align-items: baseline;
    font-size: 0.8125rem;
  }
  :global(.doc-page .kv-row:last-child) { border-bottom: none; }
  :global(.doc-page .kv-key)  { color: var(--primary); font-family: var(--font-mono); }
  :global(.doc-page .kv-type) { color: var(--muted-foreground); font-size: 0.75rem; font-family: var(--font-mono); }
  :global(.doc-page .kv-desc) { color: var(--muted-foreground); }

  /* Data tables */
  :global(.doc-page .table-scroll) { overflow-x: auto; margin: 0.875rem 0 1.5rem; }

  :global(.doc-page table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    min-width: 380px;
  }

  :global(.doc-page th) {
    text-align: left;
    padding: 0.625rem 0.875rem;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted-foreground);
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
  }

  :global(.doc-page td) {
    padding: 0.5625rem 0.875rem;
    border-bottom: 1px solid var(--border);
    color: var(--foreground);
    vertical-align: top;
    font-size: 0.8125rem;
  }
  :global(.doc-page tr:last-child td) { border-bottom: none; }
  :global(.doc-page tr:hover td) { background: rgba(166, 124, 82, 0.025); }
  :global(.doc-page .td-yes) { color: #3d9e50; font-weight: 600; text-align: center; }
  :global(.doc-page .td-no) { color: var(--muted-foreground); text-align: center; opacity: 0.55; }
  :global(.doc-page .th-dix) { color: var(--primary); }
  :global(.doc-page .td-dix) { background: rgba(166,124,82,0.03); }

  /* Tier cards */
  :global(.doc-page .tier-grid) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 0.875rem 0 1.5rem;
  }

  :global(.doc-page .tier-card) {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  :global(.doc-page .tier-label) {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary);
    padding: 0.5rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
    font-family: var(--font-mono);
  }

  :global(.doc-page .tier-pre) {
    margin: 0;
    border: none;
    border-radius: 0;
    background: var(--card);
  }

  /* Binding cards (DocFFI) */
  :global(.doc-page .bindings-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 0.875rem;
    margin: 0.875rem 0 1.5rem;
  }

  :global(.doc-page .binding-card) {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.15s;
  }
  :global(.doc-page .binding-card:hover) { border-color: var(--primary); }
  :global(.doc-page .binding-lang) { font-size: 0.75rem; font-weight: 700; padding: 0.1875rem 0.625rem; border-radius: 4px; width: fit-content; }
  :global(.doc-page .binding-pkg)  { font-size: 0.75rem; color: var(--foreground); word-break: break-all; }
  :global(.doc-page .binding-status) { font-size: 0.75rem; color: var(--muted-foreground); }

  @media (max-width: 900px) {
    :global(.doc-page .kv-row) { grid-template-columns: 150px 1fr; }
    :global(.doc-page .kv-type) { display: none; }
  }
</style>
