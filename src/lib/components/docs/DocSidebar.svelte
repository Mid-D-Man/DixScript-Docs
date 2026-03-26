<script lang="ts">
  export let sections: { id: string; label: string }[] = [];
  export let activeId = '';

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ navigate: string }>();
</script>

<aside class="sidebar">
  <div class="sidebar-label">Documentation</div>
  <nav aria-label="Documentation sections">
    {#each sections as s}
      <button
        class="sidebar-item"
        class:active={activeId === s.id}
        on:click={() => dispatch('navigate', s.id)}
        aria-current={activeId === s.id ? 'location' : undefined}
      >
        {s.label}
      </button>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    position: sticky;
    top: 4rem;
    height: calc(100vh - 4rem);
    overflow-y: auto;
    border-right: 1px solid var(--border);
    padding: 1.5rem 0.75rem;
    background: var(--background);
    transition: background 0.3s ease;
    flex-shrink: 0;
    width: 220px;
  }

  .sidebar-label {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-foreground);
    padding: 0 0.625rem;
    margin-bottom: 0.625rem;
    font-family: var(--font-mono);
  }

  .sidebar-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: var(--muted-foreground);
    padding: 0.4375rem 0.625rem;
    border-radius: var(--radius);
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 400;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
    line-height: 1.4;
  }

  .sidebar-item:hover {
    color: var(--foreground);
    background: var(--secondary);
  }

  .sidebar-item.active {
    color: var(--primary);
    background: var(--muted);
    font-weight: 600;
  }

  @media (max-width: 900px) {
    .sidebar {
      position: static;
      height: auto;
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--border);
      padding: 0.75rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .sidebar-label { display: none; }

    .sidebar-item {
      width: auto;
      padding: 0.3125rem 0.625rem;
      font-size: 0.8125rem;
    }
  }
</style>
