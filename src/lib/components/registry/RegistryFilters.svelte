<!-- src/lib/components/registry/RegistryFilters.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let activeCategory: string = 'all';
  export let search: string = '';
  export let totalCount: number = 0;
  export let filteredCount: number = 0;

  const dispatch = createEventDispatcher<{ categoryChange: string; searchChange: string }>();

  const categories: { id: string; label: string; iconPath: string }[] = [
    {
      id: 'all', label: 'All',
      iconPath: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
    },
    {
      id: 'game', label: 'Game Dev',
      iconPath: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z'
    },
    {
      id: 'ml', label: 'ML / AI',
      iconPath: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z'
    },
    {
      id: 'api', label: 'API Config',
      iconPath: 'M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495'
    },
    {
      id: 'crypto', label: 'Crypto',
      iconPath: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
    },
    {
      id: 'ecommerce', label: 'E-Commerce',
      iconPath: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
    },
    {
      id: 'utils', label: 'Utilities',
      iconPath: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'
    },
  ];

  function onInput(e: Event) {
    dispatch('searchChange', (e.target as HTMLInputElement).value);
  }
</script>

<div class="filters-wrap">
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
        on:input={onInput}
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
    <div class="result-count" aria-live="polite">
      <span class="count-num">{filteredCount}</span>
      <span class="count-sep">/</span>
      <span class="count-total">{totalCount}</span>
      <span class="count-label">package{totalCount !== 1 ? 's' : ''}</span>
    </div>
  </div>

  <div class="cat-row" role="tablist" aria-label="Filter by category">
    {#each categories as cat}
      <button
        class="cat-pill"
        class:active={activeCategory === cat.id}
        on:click={() => dispatch('categoryChange', cat.id)}
        role="tab"
        aria-selected={activeCategory === cat.id}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d={cat.iconPath}/>
        </svg>
        {cat.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .filters-wrap {
    display: flex; flex-direction: column; gap: 0.875rem;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 1rem 1.25rem;
  }

  .search-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }

  .search-field { position: relative; flex: 1; min-width: 200px; }

  .search-ico {
    position: absolute; left: 0.75rem; top: 50%;
    transform: translateY(-50%);
    color: var(--muted-foreground); pointer-events: none;
  }

  .search-input {
    width: 100%; background: var(--background); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--foreground);
    font-family: var(--font-sans); font-size: 0.875rem;
    padding: 0.5rem 2rem 0.5rem 2.25rem; outline: none;
    transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--primary); }
  .search-input::placeholder { color: var(--muted-foreground); }

  .search-clear {
    position: absolute; right: 0.75rem; top: 50%;
    transform: translateY(-50%); background: none; border: none;
    color: var(--muted-foreground); cursor: pointer;
    display: flex; align-items: center; transition: color 0.15s;
  }
  .search-clear:hover { color: var(--foreground); }

  .result-count { display: flex; align-items: baseline; gap: 0.2rem; flex-shrink: 0; }
  .count-num   { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: var(--primary); }
  .count-sep   { font-size: 0.875rem; color: var(--border); }
  .count-total { font-family: var(--font-serif); font-size: 1rem; color: var(--muted-foreground); }
  .count-label { font-size: 0.8125rem; color: var(--muted-foreground); margin-left: 0.25rem; }

  .cat-row { display: flex; flex-wrap: wrap; gap: 0.375rem; }

  .cat-pill {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.375rem 0.875rem; border-radius: 9999px;
    font-size: 0.8125rem; font-weight: 500;
    border: 1px solid var(--border); background: var(--background);
    color: var(--muted-foreground); cursor: pointer;
    transition: all 0.15s ease; font-family: var(--font-sans);
  }
  .cat-pill:hover { background: var(--secondary); color: var(--foreground); border-color: var(--primary); }
  .cat-pill.active { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }

  @media (max-width: 600px) {
    .search-row { flex-direction: column; align-items: stretch; }
    .result-count { justify-content: center; }
  }
</style>
