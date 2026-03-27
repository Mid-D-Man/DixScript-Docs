<!-- src/lib/components/playground/PlaygroundOutput.svelte -->
<script lang="ts">
  export let output: string = '';
  export let status: 'idle' | 'running' | 'done' | 'error' = 'idle';

  const statusLabel: Record<string, string> = {
    idle:    'idle',
    running: 'running…',
    done:    'done',
    error:   'error',
  };
</script>

<div class="output-pane">
  <div class="pane-header">
    <div class="dots" aria-hidden="true">
      <span class="dot dot-r"></span>
      <span class="dot dot-y"></span>
      <span class="dot dot-g"></span>
    </div>
    <span class="pane-title">output.json</span>
    <span class="status-chip status-chip--{status}" aria-live="polite">
      {#if status === 'running'}
        <svg class="spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
      {:else if status === 'done'}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
        </svg>
      {:else if status === 'error'}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      {/if}
      {statusLabel[status]}
    </span>
  </div>

  <pre class="output-body">{output || '// Click Run to execute your DixScript source'}</pre>
</div>

<style>
  .output-pane {
    display: flex;
    flex-direction: column;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    height: 100%;
  }

  .pane-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .dots { display: flex; gap: 5px; flex-shrink: 0; }
  .dot  { width: 11px; height: 11px; border-radius: 50%; }
  .dot-r { background: #f85149; }
  .dot-y { background: #e3b341; }
  .dot-g { background: #3fb950; }

  .pane-title { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--muted-foreground); flex: 1; }

  .status-chip {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.6875rem; font-weight: 700; font-family: var(--font-mono);
    text-transform: uppercase; letter-spacing: 0.06em;
    padding: 0.15rem 0.5rem; border-radius: 9999px; border: 1px solid;
  }
  .status-chip--idle    { background: var(--muted);                  color: var(--muted-foreground); border-color: var(--border);           }
  .status-chip--running { background: rgba(166,124,82,.1);           color: var(--primary);          border-color: rgba(166,124,82,.3);     }
  .status-chip--done    { background: rgba(63,185,80,.1);            color: #2a8a3a;                 border-color: rgba(63,185,80,.3);      }
  .status-chip--error   { background: rgba(181,74,53,.1);            color: var(--destructive);      border-color: rgba(181,74,53,.3);      }

  .output-body {
    flex: 1; margin: 0; border: none; border-radius: 0;
    background: var(--card);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    padding: 1rem;
    color: var(--muted-foreground);
    overflow: auto;
    white-space: pre;
  }

  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
