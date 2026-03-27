<!-- src/lib/components/playground/PlaygroundHeader.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let status: 'idle' | 'running' | 'done' | 'error' = 'idle';

  const dispatch = createEventDispatcher<{ run: void; openRegistry: void }>();
</script>

<div class="pg-header">
  <div class="pg-title-block">
    <div class="pg-title-row">
      <h1 class="pg-title">Playground</h1>
      <span class="pg-badge">WASM — Coming Soon</span>
    </div>
    <p class="pg-sub">
      Live DixScript editor. Load files from the registry or write your own.
      Run returns a simulated parse preview until <code>mdix-wasm</code> ships.
    </p>
  </div>

  <div class="pg-controls">
    <button class="registry-btn" on:click={() => dispatch('openRegistry')}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
      </svg>
      Load from Registry
    </button>

    <button
      class="run-btn"
      class:running={status === 'running'}
      on:click={() => dispatch('run')}
      disabled={status === 'running'}
      aria-label="Run DixScript"
    >
      {#if status === 'running'}
        <svg class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
        Running…
      {:else}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/>
        </svg>
        Run
      {/if}
    </button>
  </div>
</div>

<style>
  .pg-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1.5rem; flex-wrap: wrap;
  }

  .pg-title-block { display: flex; flex-direction: column; gap: 0.5rem; }
  .pg-title-row   { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

  .pg-title {
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700; color: var(--foreground); margin: 0;
  }

  .pg-badge {
    font-size: 0.625rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(166,124,82,.1); border: 1px solid rgba(166,124,82,.3);
    color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 9999px;
    font-family: var(--font-mono);
  }

  .pg-sub { font-size: 0.875rem; color: var(--muted-foreground); line-height: 1.6; max-width: 540px; margin: 0; }

  .pg-controls { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; flex-shrink: 0; }

  .registry-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--card); border: 1px solid var(--border);
    color: var(--foreground); padding: 0.6875rem 1.25rem;
    border-radius: var(--radius); font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s; font-family: var(--font-sans);
  }
  .registry-btn:hover { background: var(--secondary); border-color: var(--primary); color: var(--primary); }

  .run-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--primary); color: var(--primary-foreground);
    border: none; padding: 0.6875rem 1.5rem;
    border-radius: var(--radius); font-size: 0.9375rem; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s; font-family: var(--font-sans);
  }
  .run-btn:hover:not(:disabled) { opacity: 0.88; }
  .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .pg-controls { width: 100%; }
    .registry-btn, .run-btn { flex: 1; justify-content: center; }
  }
</style>
