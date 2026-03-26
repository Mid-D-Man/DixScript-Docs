<!-- src/lib/components/registry/RegistryFilters.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let activeCategory: string = 'all';
  export let search: string = '';
  export let totalCount: number = 0;
  export let filteredCount: number = 0;

  const dispatch = createEventDispatcher<{ categoryChange: string; searchChange: string }>();

  const categories = [
    { id: 'all',       label: 'All',        icon: '◆' },
    { id: 'game',      label: 'Game Dev',   icon: '🎮' },
    { id: 'ml',        label: 'ML / AI',    icon: '🧠' },
    { id: 'api',       label: 'API Config', icon: '⚙️' },
    { id: 'crypto',    label: 'Crypto',     icon: '🔐' },
    { id: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
    { id: 'utils',     label: 'Utilities',  icon: '🔧' },
  ];

  function selectCategory(id: string) {
    dispatch('categoryChange', id);
  }

  function onSearchInput(e: Event) {
    dispatch('searchChange', (e.target as HTMLInputElement).value);
  }
</script>

<div class="filters-wrap">
  <!-- Search row -->
  <div class="search-row">
    <div class="search-field">
      <svg class="search-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Search packages, tags, descriptions…"
        value={search}
        on:input={onSearchInput}
        aria-label="Search packages"
      />
      {#if search}
        <button class="search-clear" on:click={() => dispatch('searchChange', '')} aria-label="Clear search">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      {/if}
    </div>
    <div class="result-count">
      <span class="count-num">{filteredCount}</span>
      <span class="count-label">of {totalCount} package{totalCount !== 1 ? 's' : ''}</span>
    </div>
  </div>

  <!-- Category pills -->
  <div class="category-row" role="tablist" aria-label="Filter by category">
    {#each categories as cat}
      <button
        class="cat-pill"
        class:active={activeCategory === cat.id}
        on:click={() => selectCategory(cat.id)}
        role="tab"
        aria-selected={activeCategory === cat.id}
      >
        <span class="cat-icon" aria-hidden="true">{cat.icon}</span>
        {cat.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .filters-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
  }

  /* Search */
  .search-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .search-field {
    position: relative;
    flex: 1;
    min-width: 200px;
  }
  .search-ico {
    position: absolute;
    left: 0.75rem; top: 50%;
    transform: translateY(-50%);
    color: var(--muted-foreground);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: 0.875rem;
    padding: 0.5rem 2rem 0.5rem 2.25rem;
    outline: none;
    transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--primary); }
  .search-input::placeholder { color: var(--muted-foreground); }
  .search-clear {
    position: absolute;
    right: 0.75rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: var(--muted-foreground);
    cursor: pointer; display: flex; align-items: center;
    transition: color 0.15s;
  }
  .search-clear:hover { color: var(--foreground); }

  .result-count {
    display: flex; align-items: baseline; gap: 0.25rem;
    white-space: nowrap; flex-shrink: 0;
  }
  .count-num {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary);
  }
  .count-label { font-size: 0.8125rem; color: var(--muted-foreground); }

  /* Category pills */
  .category-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  .cat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 500;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: var(--font-sans);
  }
  .cat-pill:hover { background: var(--secondary); color: var(--foreground); border-color: var(--primary); }
  .cat-pill.active {
    background: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }
  .cat-icon { font-size: 0.875em; }

  @media (max-width: 600px) {
    .search-row { flex-direction: column; align-items: stretch; }
    .result-count { justify-content: center; }
  }
</style>
