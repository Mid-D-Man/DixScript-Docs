<!-- src/lib/components/admin/AdminPackageRow.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let name: string;
  export let path: string;
  export let category: string = 'utils';
  export let size: number = 0;
  export let uploaded: string | null = null;
  export let desc: string = '';
  export let addedBy: string = 'MidManStudio';
  export let version: string = '1.0.0';

  const dispatch = createEventDispatcher<{ delete: string }>();

  let confirming = false;
  let deleting   = false;

  function formatSize(b: number) {
    if (b < 1024) return `${b} B`;
    return `${(b / 1024).toFixed(1)} KB`;
  }
  function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function startDelete() { confirming = true; }
  function cancelDelete() { confirming = false; }

  function confirmDelete() {
    deleting = true;
    dispatch('delete', path);
  }
</script>

<div class="row" class:deleting>
  <div class="row-main">
    <div class="row-icon">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
      </svg>
    </div>
    <div class="row-info">
      <div class="row-name">
        <span class="name-text">{name}</span>
        <span class="cat-badge">{category}</span>
        <span class="ver-badge">v{version}</span>
      </div>
      <div class="row-path">{path}</div>
      {#if desc}
        <div class="row-desc">{desc}</div>
      {/if}
    </div>
  </div>

  <div class="row-meta">
    <span class="meta-item">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
      </svg>
      {formatSize(size)}
    </span>
    <span class="meta-item">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
      </svg>
      {formatDate(uploaded)}
    </span>
    <span class="meta-item">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>
      </svg>
      {addedBy}
    </span>
  </div>

  <div class="row-actions">
    {#if confirming}
      <span class="confirm-label">Delete?</span>
      <button class="action-btn action-btn--danger" on:click={confirmDelete} disabled={deleting}>
        {#if deleting}
          <svg class="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        {:else}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
          </svg>
        {/if}
        Yes, delete
      </button>
      <button class="action-btn" on:click={cancelDelete}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
        Cancel
      </button>
    {:else}
      <button class="action-btn action-btn--delete" on:click={startDelete}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
        Delete
      </button>
    {/if}
  </div>
</div>

<style>
  .row {
    display: flex; flex-direction: column; gap: 0.625rem;
    padding: 1rem 1.125rem;
    background: var(--card); border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .row:last-child { border-bottom: none; }
  .row:hover { background: var(--muted); }
  .row.deleting { opacity: 0.5; pointer-events: none; }

  .row-main { display: flex; align-items: flex-start; gap: 0.75rem; }

  .row-icon {
    width: 2rem; height: 2rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    color: var(--primary); margin-top: 2px;
  }

  .row-info { flex: 1; min-width: 0; }

  .row-name { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
  .name-text { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; color: var(--foreground); }

  .cat-badge, .ver-badge {
    font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; padding: 0.15rem 0.5rem;
    border-radius: 9999px; font-family: var(--font-mono); border: 1px solid;
  }
  .cat-badge { background: rgba(166,124,82,.1); color: var(--primary); border-color: rgba(166,124,82,.3); }
  .ver-badge { background: var(--secondary); color: var(--muted-foreground); border-color: var(--border); }

  .row-path { font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted-foreground); }
  .row-desc { font-size: 0.8125rem; color: var(--muted-foreground); line-height: 1.5; margin-top: 0.25rem; }

  .row-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .meta-item {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.75rem; color: var(--muted-foreground); font-family: var(--font-mono);
  }

  .row-actions { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

  .confirm-label { font-size: 0.8125rem; color: var(--destructive); font-weight: 600; }

  .action-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.375rem 0.75rem; border-radius: var(--radius);
    font-size: 0.8125rem; font-weight: 600; cursor: pointer;
    border: 1px solid var(--border); background: var(--card);
    color: var(--foreground); font-family: var(--font-sans);
    transition: all 0.15s;
  }
  .action-btn:hover { background: var(--secondary); }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .action-btn--delete { color: var(--destructive); border-color: rgba(181,74,53,.3); }
  .action-btn--delete:hover { background: rgba(181,74,53,.08); }

  .action-btn--danger { background: var(--destructive); color: #fff; border-color: var(--destructive); }
  .action-btn--danger:hover { opacity: 0.88; background: var(--destructive); }

  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
