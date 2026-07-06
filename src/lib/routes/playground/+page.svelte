<!-- src/lib/routes/playground/+page.svelte -->
<script lang="ts">
  import PlaygroundHeader from '$lib/components/playground/PlaygroundHeader.svelte';
  import PlaygroundEditor from '$lib/components/playground/PlaygroundEditor.svelte';
  import PlaygroundOutput from '$lib/components/playground/PlaygroundOutput.svelte';
  import RegistryPicker  from '$lib/components/playground/RegistryPicker.svelte';

  const DEFAULT_SOURCE = `@CONFIG(
  version  -> "1.0.0"
  features -> "advanced"
)

@ENUMS(
  Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
)

@QUICKFUNCS(
  ~item<object>(id<string>, name<string>, rarity<enum>, value<int>) {
    return {
      id     = id
      name   = name
      rarity = rarity
      value  = value
      sell   = value / 2
      buy    = value * 4
    }
  }
)

@DATA(
  game_title = "DixScript Demo"
  version    = "1.0.0"

  loot::
    item("I001", "Rusty Sword",   Rarity.COMMON,    25),
    item("I002", "Mystic Staff",  Rarity.RARE,      120),
    item("I003", "Dragon Shield", Rarity.LEGENDARY, 500)
)`;

  let source = DEFAULT_SOURCE;
  let output = '';
  let status: 'idle' | 'running' | 'done' | 'error' = 'idle';
  let showPicker = false;

  // Loaded lazily on first Run — keeps the WASM module out of the initial
  // page bundle, and this file only ever runs client-side anyway (see
  // +page.ts -> ssr = false).
  let corePromise: Promise<typeof import('@dixscript/core')> | null = null;

  async function run() {
    status = 'running';
    try {
      if (!corePromise) corePromise = import('@dixscript/core');
      const { MdixDatabase } = await corePromise;

      const db = MdixDatabase.loadStr(source);
      try {
        output = db.toJson(true);
        status = 'done';
      } finally {
        db.free(); // WASM memory isn't garbage collected
      }
    } catch (err) {
      output = err instanceof Error ? err.message : String(err);
      status = 'error';
    }
  }

  function reset() {
    source = DEFAULT_SOURCE;
    output = ''; status = 'idle';
  }

  function onRegistryLoad(e: CustomEvent<string>) {
    source = e.detail;
    showPicker = false;
    output = ''; status = 'idle';
  }
</script>

<svelte:head>
  <title>DixScript Playground</title>
  <meta name="description" content="Try DixScript in the browser — load from registry or write your own." />
</svelte:head>

{#if showPicker}
  <RegistryPicker on:load={onRegistryLoad} on:close={() => (showPicker = false)} />
{/if}

<div class="pg-page">
  <PlaygroundHeader {status} on:run={run} on:openRegistry={() => (showPicker = true)} />

  <div class="pg-notice">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:2px;color:var(--primary)">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286z"/>
    </svg>
    <span>
      Running on <code>@dixscript/core</code>, compiled from the Rust core to WebAssembly —
      loaded and executed entirely in your browser, nothing is sent to a server.
      See it on <a href="https://github.com/Mid-D-Man/DixScript-Rust/tree/master/mdix-wasm" target="_blank" rel="noopener">GitHub</a>.
    </span>
  </div>

  <div class="pg-workspace">
    <PlaygroundEditor bind:source />
    <PlaygroundOutput {output} {status} />
  </div>

  <div class="pg-footer">
    <div class="footer-links">
      <a href="/docs" class="footer-link">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
        </svg>
        Docs
      </a>
      <a href="/registry" class="footer-link">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
        </svg>
        Registry
      </a>
      <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener" class="footer-link">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0112 5.803c.955.005 1.917.128 2.805.374 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a>
    </div>
    <button class="reset-btn" on:click={reset}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
      </svg>
      Reset
    </button>
  </div>
</div>

<style>
  .pg-page {
    max-width: 1360px; margin: 0 auto;
    padding: 2rem 1.5rem 2.5rem;
    display: flex; flex-direction: column; gap: 1.25rem;
    min-height: calc(100vh - 4rem);
  }

  .pg-notice {
    display: flex; align-items: flex-start; gap: 0.625rem;
    background: var(--secondary); border: 1px solid var(--border);
    border-left: 3px solid var(--primary); border-radius: var(--radius);
    padding: 0.75rem 1rem; font-size: 0.875rem;
    color: var(--foreground); line-height: 1.6;
  }
  .pg-notice a { color: var(--primary); text-decoration: underline; }

  .pg-workspace {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
    flex: 1; min-height: 520px; max-height: 680px;
  }

  .pg-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap; padding-top: 0.75rem;
    border-top: 1px solid var(--border);
  }

  .footer-links { display: flex; gap: 0.25rem; flex-wrap: wrap; }
  .footer-link {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.8125rem; color: var(--muted-foreground);
    text-decoration: none; padding: 0.375rem 0.75rem;
    border-radius: var(--radius); transition: all 0.15s;
    border: 1px solid transparent;
  }
  .footer-link:hover { color: var(--foreground); background: var(--secondary); border-color: var(--border); }

  .reset-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    font-size: 0.8125rem; font-weight: 500;
    background: none; border: 1px solid var(--border);
    color: var(--muted-foreground); padding: 0.375rem 0.875rem;
    border-radius: var(--radius); cursor: pointer;
    transition: all 0.15s; font-family: var(--font-sans);
  }
  .reset-btn:hover { background: var(--secondary); color: var(--foreground); border-color: var(--primary); }

  @media (max-width: 900px) {
    .pg-page { padding: 1.25rem 1rem; }
    .pg-workspace { grid-template-columns: 1fr; max-height: none; min-height: 0; }
  }
</style>
