<!-- src/lib/components/registry/RegistryModal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let filename: string = '';
  export let content: string = '';
  export let loading: boolean = false;
  export let error: string | null = null;

  const dispatch = createEventDispatcher<{ close: void }>();

  function close() { dispatch('close'); }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  let copied = false;
  async function copyContent() {
    try { await navigator.clipboard.writeText(content); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = content; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-backdrop" on:click={close} role="presentation"></div>

<div class="modal-panel" role="dialog" aria-modal="true" aria-label="File viewer: {filename}">
  <div class="modal-header">
    <div class="modal-title-row">
      <div class="modal-dots" aria-hidden="true">
        <span class="dot dot-r"></span>
        <span class="dot dot-y"></span>
        <span class="dot dot-g"></span>
      </div>
      <span class="modal-filename">{filename}</span>
    </div>
    <div class="modal-actions">
      {#if !loading && !error && content}
        <button class="modal-btn" on:click={copyContent} aria-label="Copy file content">
          {#if copied}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            Copied
          {:else}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
            </svg>
            Copy
          {/if}
        </button>
      {/if}
      <button class="modal-btn modal-btn--close" on:click={close} aria-label="Close">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="modal-body">
    {#if loading}
      <div class="modal-state">
        <div class="spinner" aria-label="Loading"></div>
        <span>Loading {filename}…</span>
      </div>
    {:else if error}
      <div class="modal-state modal-state--error">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <span>{error}</span>
      </div>
    {:else}
      <pre class="modal-code"><code>{content}</code></pre>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 200;
    animation: fadein 0.15s ease;
  }

  .modal-panel {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 201;
    width: min(860px, 95vw);
    max-height: 85vh;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: slideup 0.2s ease;
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.625rem 1rem;
    background: var(--secondary); border-bottom: 1px solid var(--border);
    flex-shrink: 0; gap: 0.75rem;
  }

  .modal-title-row { display: flex; align-items: center; gap: 0.625rem; min-width: 0; }
  .modal-dots { display: flex; gap: 5px; flex-shrink: 0; }
  .dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
  .dot-r { background: #f85149; }
  .dot-y { background: #e3b341; }
  .dot-g { background: #3fb950; }

  .modal-filename {
    font-family: var(--font-mono); font-size: 0.8125rem;
    color: var(--foreground); font-weight: 600;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .modal-actions { display: flex; align-items: center; gap: 0.375rem; flex-shrink: 0; }

  .modal-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    background: var(--muted); border: 1px solid var(--border);
    color: var(--foreground); font-family: var(--font-mono);
    font-size: 0.75rem; padding: 0.3rem 0.75rem;
    border-radius: var(--radius); cursor: pointer; transition: all 0.15s;
  }
  .modal-btn:hover { background: var(--accent); border-color: var(--primary); }
  .modal-btn--close { padding: 0.3rem 0.5rem; }

  .modal-body { flex: 1; overflow-y: auto; overflow-x: auto; min-height: 200px; }

  .modal-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1rem; padding: 3rem;
    color: var(--muted-foreground); font-size: 0.875rem;
  }
  .modal-state--error { color: var(--destructive); }

  .spinner {
    width: 28px; height: 28px;
    border: 2px solid var(--border); border-top-color: var(--primary);
    border-radius: 50%; animation: spin 0.65s linear infinite;
  }

  .modal-code {
    margin: 0; border: none; border-radius: 0;
    background: var(--card); font-size: 0.8125rem; line-height: 1.75;
    padding: 1.25rem 1.5rem; color: var(--foreground);
    min-height: 200px; overflow-x: auto;
    word-break: normal; white-space: pre;
  }
  .modal-code code {
    background: none; border: none; padding: 0;
    font-size: inherit; color: inherit; white-space: pre;
    display: block; min-width: max-content;
  }

  @keyframes fadein  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideup {
    from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
    to   { opacity: 1; transform: translate(-50%, -50%); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
