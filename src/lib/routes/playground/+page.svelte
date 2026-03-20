<script lang="ts">
  let source = `@CONFIG(
  version  -> "1.0.0"
  features -> "advanced"
)

@ENUMS(
  Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
)

@QUICKFUNCS(
  ~item<object>(id<string>, name<string>, rarity<enum>) {
    return {
      id     = id
      name   = name
      rarity = rarity
    }
  }
)

@DATA(
  game_title = "DixScript Demo"
  version    = "1.0.0"

  loot::
    item("I001", "Rusty Sword",   Rarity.COMMON),
    item("I002", "Mystic Staff",  Rarity.RARE),
    item("I003", "Dragon Shield", Rarity.LEGENDARY)
)`;

  let output = '';
  let status: 'idle' | 'running' | 'done' | 'error' = 'idle';

  function runPlaceholder() {
    status = 'running';
    setTimeout(() => {
      output = `// WASM runtime not yet connected.
// This playground will execute DixScript live once
// mdix-wasm is published to npm.
//
// Parsed structure preview (simulated):
{
  "game_title": "DixScript Demo",
  "version": "1.0.0",
  "loot": [
    { "id": "I001", "name": "Rusty Sword",   "rarity": { "enum_name": "Rarity", "field_name": "COMMON",    "value": 0 } },
    { "id": "I002", "name": "Mystic Staff",  "rarity": { "enum_name": "Rarity", "field_name": "RARE",      "value": 2 } },
    { "id": "I003", "name": "Dragon Shield", "rarity": { "enum_name": "Rarity", "field_name": "LEGENDARY", "value": 4 } }
  ]
}`;
      status = 'done';
    }, 600);
  }
</script>

<svelte:head><title>DixScript Playground</title></svelte:head>

<div class="pg-wrap">
  <div class="pg-header">
    <div>
      <h1 class="pg-title">Playground <span class="pg-badge">Coming Soon</span></h1>
      <p class="pg-sub">Live DixScript editor — powered by mdix-wasm once the runtime is complete.</p>
    </div>
    <button class="run-btn" on:click={runPlaceholder} disabled={status === 'running'}>
      {status === 'running' ? '⏳ Running…' : '▶ Run'}
    </button>
  </div>

  <div class="pg-notice">
    The WASM runtime is not yet published. The editor and output panel are functional — the execution engine will be wired in once <code>mdix-wasm</code> is available. In the meantime, Run returns a simulated preview.
  </div>

  <div class="pg-panes">
    <div class="pane">
      <div class="pane-header">
        <span class="pane-title">Editor</span>
        <span class="pane-file">input.mdix</span>
      </div>
      <textarea
        class="editor"
        bind:value={source}
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
      ></textarea>
    </div>

    <div class="pane">
      <div class="pane-header">
        <span class="pane-title">Output</span>
        <span class="pane-status {status}">{status === 'idle' ? 'idle' : status === 'running' ? 'running…' : status === 'done' ? '✓ done' : '✗ error'}</span>
      </div>
      <pre class="output-area">{output || '// Click Run to execute'}</pre>
    </div>
  </div>

  <div class="pg-footer">
    <span>Syntax help: <a href="/docs">Documentation</a></span>
    <span>Importable files: <a href="/registry">Registry</a></span>
    <span>Runtime source: <a href="https://github.com/Mid-D-Man/DixScript-Rust/tree/master/mdix-wasm" target="_blank" rel="noopener">mdix-wasm on GitHub ↗</a></span>
  </div>
</div>

<style>
  .pg-wrap { max-width: 1280px; margin: 0 auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 20px; }
  .pg-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .pg-title { font-size: 1.6rem; display: flex; align-items: center; gap: 12px; }
  .pg-badge { font-size: 0.65rem; font-weight: 700; background: rgba(227,179,65,.1); border: 1px solid rgba(227,179,65,.3); color: var(--yellow); padding: 3px 9px; border-radius: 20px; vertical-align: middle; }
  .pg-sub { color: var(--muted); font-size: 0.875rem; margin-top: 6px; }

  .run-btn {
    background: var(--accent); color: #fff; border: none;
    padding: 10px 24px; border-radius: 8px; font-size: 0.875rem;
    font-weight: 700; cursor: pointer; transition: background .15s;
    flex-shrink: 0;
  }
  .run-btn:hover:not(:disabled) { background: #e0705a; }
  .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .pg-notice {
    background: rgba(88,166,255,.06); border: 1px solid rgba(88,166,255,.2);
    border-radius: 8px; padding: 12px 16px; font-size: 0.875rem; color: var(--blue);
    line-height: 1.6;
  }

  .pg-panes { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 520px; }

  .pane { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .pane-header { display: flex; align-items: center; justify-content: space-between; padding: 9px 16px; background: var(--surface2); border-bottom: 1px solid var(--border); }
  .pane-title { font-size: 0.80rem; font-weight: 700; color: var(--text); }
  .pane-file { font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint); }
  .pane-status { font-size: 0.72rem; font-weight: 700; }
  .pane-status.idle    { color: var(--faint); }
  .pane-status.running { color: var(--yellow); }
  .pane-status.done    { color: var(--green); }
  .pane-status.error   { color: #f85149; }

  .editor {
    flex: 1; background: var(--surface); color: var(--text);
    font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.7;
    border: none; outline: none; resize: none;
    padding: 16px 18px; tab-size: 2;
  }

  .output-area {
    flex: 1; border: none; border-radius: 0; margin: 0;
    background: var(--surface); overflow: auto;
    color: var(--muted);
  }

  .pg-footer { display: flex; gap: 20px; flex-wrap: wrap; font-size: 0.80rem; color: var(--faint); border-top: 1px solid var(--border2); padding-top: 16px; }

  @media (max-width: 768px) {
    .pg-panes { grid-template-columns: 1fr; height: auto; }
    .editor, .output-area { height: 300px; }
  }
</style>
