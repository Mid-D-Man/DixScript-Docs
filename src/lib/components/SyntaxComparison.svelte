<script lang="ts">
  import { onMount } from 'svelte';

  const jsonCode = `{
  "enemies": [
    {"id": 1, "name": "Goblin",   "health": 20, "damage": 5,  "speed": 8,  "xp": 50},
    {"id": 2, "name": "Goblin",   "health": 20, "damage": 5,  "speed": 8,  "xp": 50},
    {"id": 3, "name": "Goblin",   "health": 20, "damage": 5,  "speed": 8,  "xp": 50},
    {"id": 4, "name": "Orc",      "health": 45, "damage": 12, "speed": 6,  "xp": 150},
    {"id": 5, "name": "Orc",      "health": 45, "damage": 12, "speed": 6,  "xp": 150},
    {"id": 6, "name": "Skeleton", "health": 30, "damage": 8,  "speed": 10, "xp": 75},
    {"id": 7, "name": "Skeleton", "health": 30, "damage": 8,  "speed": 10, "xp": 75},
    {"id": 8, "name": "Dragon",   "health": 200,"damage": 45, "speed": 12, "xp": 1000},
    {"id": 9, "name": "Goblin",   "health": 20, "damage": 5,  "speed": 8,  "xp": 50},
    {"id": 10,"name": "Orc",      "health": 45, "damage": 12, "speed": 6,  "xp": 150}
  ]
}`;

  const dixCode = `@QUICKFUNCS(
  ~enemy(id, name, health, damage, speed, xp) {
    return {
      id = id  name = name  health = health
      damage = damage  speed = speed  xp = xp
    }
  }
)

@DATA(
  enemies::
    enemy(1,  "Goblin",   20,  5,  8,  50),
    enemy(2,  "Goblin",   20,  5,  8,  50),
    enemy(3,  "Goblin",   20,  5,  8,  50),
    enemy(4,  "Orc",      45,  12, 6,  150),
    enemy(5,  "Orc",      45,  12, 6,  150),
    enemy(6,  "Skeleton", 30,  8,  10, 75),
    enemy(7,  "Skeleton", 30,  8,  10, 75),
    enemy(8,  "Dragon",   200, 45, 12, 1000),
    enemy(9,  "Goblin",   20,  5,  8,  50),
    enemy(10, "Orc",      45,  12, 6,  150)
)`;

  let jsonBytes = 0;
  let dixBytes = 0;
  let savings = 0;

  onMount(() => {
    jsonBytes = new Blob([jsonCode]).size;
    dixBytes  = new Blob([dixCode]).size;
    savings   = Math.round((1 - dixBytes / jsonBytes) * 100);
  });

  let jsonCopied = false;
  let dixCopied  = false;

  async function copy(text: string, which: 'json' | 'dix') {
    await navigator.clipboard.writeText(text);
    if (which === 'json') {
      jsonCopied = true;
      setTimeout(() => jsonCopied = false, 2000);
    } else {
      dixCopied = true;
      setTimeout(() => dixCopied = false, 2000);
    }
  }
</script>

<section class="comparison" id="see-it-in-action">
  <div class="comparison-inner">

    <div class="section-header">
      <h2>See It In Action</h2>
      <p>10 enemies reduced — same data, dramatically fewer characters. The bigger the dataset, the more DixScript saves.</p>
    </div>

    <div class="panels">

      <!-- JSON Panel -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
          </div>
          <span class="panel-title">JSON Format</span>
          <button
            class="copy-btn"
            on:click={() => copy(jsonCode, 'json')}
            aria-label="Copy JSON code"
          >
            {#if jsonCopied}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Copied
            {:else}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            {/if}
          </button>
        </div>
        <pre class="code-block"><code>{jsonCode}</code></pre>
        <div class="panel-footer panel-footer--bad">
          <span class="byte-count">{jsonBytes} bytes</span>
          <span class="byte-label">of pure repetition</span>
        </div>
      </div>

      <!-- DixScript Panel -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
          </div>
          <span class="panel-title">DixScript (.mdix)</span>
          <button
            class="copy-btn"
            on:click={() => copy(dixCode, 'dix')}
            aria-label="Copy DixScript code"
          >
            {#if dixCopied}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Copied
            {:else}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            {/if}
          </button>
        </div>
        <pre class="code-block"><code>{dixCode}</code></pre>
        <div class="panel-footer panel-footer--good">
          <span class="byte-count">{dixBytes} bytes</span>
          <span class="byte-label">smart deduplication</span>
        </div>
      </div>

    </div>

    <!-- Savings Banner -->
    <div class="savings-banner">
      <div class="savings-main">
        <span class="savings-value">{savings}% Smaller</span>
        <span class="savings-desc">
          DixScript saves <strong>{jsonBytes - dixBytes} bytes</strong> on just 10 entries.
          Real configs with hundreds of repeated objects compress even further.
        </span>
      </div>
      <div class="savings-extra">
        Plus: type safety · compile-time execution · zero duplication
      </div>
    </div>

  </div>
</section>

<style>
  .comparison {
    padding: 5rem 1.5rem;
    background: var(--card);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .comparison-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ── Header ── */
  .section-header {
    text-align: center;
  }

  .section-header h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin-bottom: 0.75rem;
  }

  .section-header p {
    font-size: 1rem;
    color: var(--muted-foreground);
    max-width: 540px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ── Panels ── */
  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .panel {
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
  }

  .panel-dots {
    display: flex;
    gap: 5px;
    margin-right: 0.375rem;
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }

  .dot-r { background: #f85149; }
  .dot-y { background: #e3b341; }
  .dot-g { background: #3fb950; }

  .panel-title {
    font-family: var(--font-mono);
    font-size: 0.78125rem;
    color: var(--muted-foreground);
    flex: 1;
  }

  .copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .copy-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .code-block {
    flex: 1;
    margin: 0;
    border: none;
    border-radius: 0;
    background: var(--background);
    font-size: 0.8125rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .code-block code {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: var(--foreground);
  }

  .panel-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-top: 1px solid var(--border);
    font-size: 0.8125rem;
  }

  .panel-footer--bad  { background: rgba(185, 84, 53, 0.05); }
  .panel-footer--good { background: rgba(63, 185, 80, 0.05);  }

  .byte-count {
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--foreground);
  }

  .byte-label {
    color: var(--muted-foreground);
  }

  /* ── Savings Banner ── */
  .savings-banner {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .savings-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .savings-value {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    flex-shrink: 0;
  }

  .savings-desc {
    font-size: 0.9375rem;
    color: var(--foreground);
    line-height: 1.6;
  }

  .savings-extra {
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .panels {
      grid-template-columns: 1fr;
    }

    .comparison {
      padding: 3rem 1rem;
    }
  }
</style>
