<script lang="ts">
  // Intentionally empty — this is a layout shell only
</script>

<div class="docs-shell">
  <slot name="sidebar" />
  <div class="docs-content-wrap">
    <slot />
  </div>
</div>

<style>
  .docs-shell {
    display: flex;
    align-items: flex-start;
    min-height: calc(100vh - 4rem);
  }

  .docs-content-wrap {
    flex: 1;
    min-width: 0;
    padding: 2.5rem 3rem;
    max-width: 820px;
  }

  /* ─────────────────────────────────────────────
     Shared doc section styles — :global() so they
     apply to all child section components
  ───────────────────────────────────────────── */

  :global(.doc-section) {
    margin-bottom: 4rem;
    scroll-margin-top: 5rem;
  }

  :global(.doc-section h1) {
    font-family: var(--font-serif);
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
    line-height: 1.25;
  }

  :global(.doc-section h2) {
    font-family: var(--font-serif);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
    line-height: 1.3;
  }

  :global(.doc-section > h2:first-child) {
    margin-top: 0;
  }

  :global(.doc-section h3) {
    font-family: var(--font-serif);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--foreground);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  :global(.doc-section p) {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  :global(.doc-section strong) {
    color: var(--foreground);
    font-weight: 600;
  }

  :global(.doc-section a) {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.15s ease;
  }

  :global(.doc-section a:hover) {
    opacity: 0.75;
  }

  :global(.doc-section pre) {
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.125rem;
    overflow-x: auto;
    font-size: 0.8125rem;
    line-height: 1.75;
    margin: 1rem 0 1.5rem;
    color: var(--foreground);
  }

  :global(.doc-section pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: inherit;
  }

  :global(.doc-section code) {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 6px;
    color: var(--foreground);
  }

  :global(.doc-section ul),
  :global(.doc-section ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  :global(.doc-section li) {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.7;
  }

  :global(.doc-section .kv-table) {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin: 1rem 0 1.5rem;
  }

  :global(.doc-section .kv-row) {
    display: grid;
    grid-template-columns: 200px 80px 1fr;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--border);
    align-items: baseline;
    font-size: 0.8125rem;
  }

  :global(.doc-section .kv-row:last-child) {
    border-bottom: none;
  }

  :global(.doc-section .kv-key) {
    color: var(--primary);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
  }

  :global(.doc-section .kv-type) {
    color: var(--muted-foreground);
    font-size: 0.75rem;
    font-family: var(--font-mono);
  }

  :global(.doc-section .kv-desc) {
    color: var(--muted-foreground);
  }

  :global(.doc-section .tier-grid) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0 1.5rem;
  }

  :global(.doc-section .tier-card) {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  :global(.doc-section .tier-label) {
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

  :global(.doc-section .tier-pre) {
    margin: 0;
    border: none;
    border-radius: 0;
    background: var(--card);
    font-size: 0.8125rem;
  }

  :global(.doc-section .table-scroll) {
    overflow-x: auto;
    margin: 1rem 0 1.5rem;
  }

  :global(.doc-section table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  :global(.doc-section th) {
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

  :global(.doc-section td) {
    padding: 0.5625rem 0.875rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.8125rem;
    color: var(--foreground);
    vertical-align: middle;
  }

  :global(.doc-section tr:last-child td) { border-bottom: none; }
  :global(.doc-section tr:hover td)      { background: var(--secondary); }

  :global(.doc-section .td-yes)     { color: #3d9e50; font-weight: 600; text-align: center; }
  :global(.doc-section .td-no)      { color: var(--muted-foreground); text-align: center; opacity: 0.6; }
  :global(.doc-section .td-partial) { color: var(--primary); text-align: center; }
  :global(.doc-section .td-feature) { font-weight: 500; }
  :global(.doc-section .th-dix)     { color: var(--primary); }
  :global(.doc-section .td-dix)     { background: rgba(166,124,82,0.04); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .docs-content-wrap { padding: 1.5rem 1rem; }
    :global(.doc-section .kv-row) { grid-template-columns: 160px 1fr; }
    :global(.doc-section .kv-type) { display: none; }
  }
</style>
