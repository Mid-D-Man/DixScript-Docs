<!-- src/lib/components/playground/RegistryPicker.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher<{ load: string; close: void }>();

  type Pkg = { name: string; path: string; displayName: string; desc: string; category: string; tags: string[]; downloadUrl: string; };

  let packages: Pkg[] = [];
  let loading  = true;
  let error    = '';
  let search   = '';
  let fetching: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/registry');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      packages = (data.files ?? []).map((f: any) => ({
        ...f,
        displayName: f.name.replace('.mdix', ''),
      }));
    } catch (e: any) {
      error = e?.message ?? 'Failed to load registry';
    } finally {
      loading = false;
    }
  });

  $: filtered = packages.filter(p => {
    const q = search.toLowerCase();
    return !q
      || p.displayName.toLowerCase().includes(q)
      || p.desc?.toLowerCase().includes(q)
      || p.tags?.some((t: string) => t.includes(q));
  });

  async function selectPkg(pkg: Pkg) {
    fetching = pkg.name;
    try {
      const res = await fetch(pkg.downloadUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();
      dispatch('load', content);
    } catch (e: any) {
      error = `Failed to load ${pkg.name}: ${e?.message}`;
    } finally {
      fetching = null;
    }
  }

  function handleBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('picker-backdrop')) {
      dispatch('close');
    }
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') dispatch('close');
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="picker-backdrop" on:click={handleBackdrop} role="presentation">
  <div class="picker-panel" role="dialog" aria-modal="true" aria-label="Load from Registry">

    <div class="picker-header">
      <div class="picker-title-row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
        </svg>
        Load from Registry
      </div>
      <button class="picker-close" on:click={() => dispatch('close')} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Search -->
    <div class="picker-search">
      <svg class="search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z"/>
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Search packages…"
        bind:value={search}
        aria-label="Search registry packages"
        autofocus
      />
    </div>

    <!-- Body -->
    <div class="picker-body">
      {#if error}
        <div class="picker-state picker-state--error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          {error}
        </div>
      {:else if loading}
        <div class="picker-state">
          <div class="mini-spinner"></div>
          Loading registry…
        </div>
      {:else if filtered.length === 0}
        <div class="picker-state">No packages match "{search}"</div>
      {:else}
        {#each filtered as pkg (pkg.name)}
          <button
            class="pkg-row"
            class:loading-row={fetching === pkg.name}
            on:click={() => selectPkg(pkg)}
            disabled={fetching !== null}
          >
            <div class="pkg-row-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
            </div>
            <div class="pkg-row-info">
              <div class="pkg-row-name">
                <span class="pkg-name">{pkg.displayName}</span>
                <span class="pkg-ext">.mdix</span>
                <span class="pkg-cat">{pkg.category}</span>
              </div>
              {#if pkg.desc}
                <div class="pkg-row-desc">{pkg.desc}</div>
              {/if}
            </div>
            <div class="pkg-row-action">
              {#if fetching === pkg.name}
                <div class="mini-spinner"></div>
              {:else}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              {/if}
            </div>
          </button>
        {/each}
      {/if}
    </div>

    <div class="picker-footer">
      <span class="picker-count">{filtered.length} package{filtered.length !== 1 ? 's' : ''}</span>
      <a href="/registry" target="_blank" rel="noopener" class="picker-registry-link">
        Browse full registry
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
        </svg>
      </a>
    </div>
  </div>
</div>

<style>
  .picker-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 150;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadein 0.15s ease;
  }

  .picker-panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
    width: min(560px, 100%); max-height: 75vh;
    display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: slideup 0.18s ease;
  }

  .picker-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.875rem 1rem; background: var(--secondary);
    border-bottom: 1px solid var(--border); flex-shrink: 0;
  }

  .picker-title-row {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.9375rem; font-weight: 700; color: var(--foreground);
    font-family: var(--font-serif);
  }

  .picker-close {
    display: flex; align-items: center; justify-content: center;
    width: 1.75rem; height: 1.75rem;
    background: var(--muted); border: 1px solid var(--border);
    border-radius: var(--radius); cursor: pointer;
    color: var(--muted-foreground); transition: all 0.15s;
  }
  .picker-close:hover { background: var(--accent); color: var(--foreground); }

  /* Search */
  .picker-search {
    position: relative; padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .search-ico {
    position: absolute; left: 1.25rem; top: 50%;
    transform: translateY(-50%); color: var(--muted-foreground); pointer-events: none;
  }
  .search-input {
    width: 100%; background: var(--background); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--foreground);
    font-family: var(--font-sans); font-size: 0.875rem;
    padding: 0.4375rem 0.75rem 0.4375rem 2.125rem; outline: none;
    transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--primary); }
  .search-input::placeholder { color: var(--muted-foreground); }

  /* Body */
  .picker-body { flex: 1; overflow-y: auto; }

  .picker-state {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    padding: 2.5rem; font-size: 0.875rem; color: var(--muted-foreground);
  }
  .picker-state--error { color: var(--destructive); }

  .pkg-row {
    display: flex; align-items: center; gap: 0.75rem;
    width: 100%; padding: 0.75rem 1rem; text-align: left;
    background: none; border: none; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.12s; font-family: var(--font-sans);
  }
  .pkg-row:last-child { border-bottom: none; }
  .pkg-row:hover:not(:disabled) { background: var(--muted); }
  .pkg-row.loading-row { opacity: 0.6; cursor: wait; }
  .pkg-row:disabled { cursor: not-allowed; }

  .pkg-row-icon {
    width: 1.75rem; height: 1.75rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 5px; display: flex; align-items: center; justify-content: center;
    color: var(--primary);
  }

  .pkg-row-info { flex: 1; min-width: 0; }
  .pkg-row-name { display: flex; align-items: baseline; gap: 0.375rem; flex-wrap: wrap; margin-bottom: 0.125rem; }
  .pkg-name { font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700; color: var(--foreground); }
  .pkg-ext  { font-family: var(--font-mono); font-size: 0.875rem; color: var(--muted-foreground); }
  .pkg-cat  {
    font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; padding: 0.15rem 0.5rem; border-radius: 9999px;
    background: rgba(166,124,82,.1); color: var(--primary);
    border: 1px solid rgba(166,124,82,.3); font-family: var(--font-mono);
  }
  .pkg-row-desc { font-size: 0.8rem; color: var(--muted-foreground); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .pkg-row-action { flex-shrink: 0; color: var(--primary); }

  /* Footer */
  .picker-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.625rem 1rem; border-top: 1px solid var(--border);
    background: var(--secondary); flex-shrink: 0;
  }
  .picker-count { font-size: 0.8125rem; color: var(--muted-foreground); font-family: var(--font-mono); }
  .picker-registry-link {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.8125rem; color: var(--primary); text-decoration: underline;
    transition: opacity 0.15s;
  }
  .picker-registry-link:hover { opacity: 0.75; }

  .mini-spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border); border-top-color: var(--primary);
    border-radius: 50%; animation: spin 0.65s linear infinite;
  }

  @keyframes fadein  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideup { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
</style>
