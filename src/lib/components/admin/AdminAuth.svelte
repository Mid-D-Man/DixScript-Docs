<!-- src/lib/components/admin/AdminAuth.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ unlock: string }>();

  let key = '';
  let error = '';
  let checking = false;

  async function submit() {
    if (!key.trim()) { error = 'Enter the admin key.'; return; }
    checking = true; error = '';
    try {
      const res = await fetch('/api/admin/list', {
        headers: { Authorization: `Bearer ${key.trim()}` }
      });
      if (res.ok) {
        dispatch('unlock', key.trim());
      } else {
        error = 'Invalid admin key.';
      }
    } catch {
      error = 'Connection failed.';
    } finally {
      checking = false;
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') submit();
  }
</script>

<div class="auth-wrap">
  <div class="auth-card">
    <div class="auth-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    </div>
    <h1 class="auth-title">Admin Dashboard</h1>
    <p class="auth-sub">Enter your admin key to continue.</p>

    <div class="auth-field">
      <input
        type="password"
        class="auth-input"
        placeholder="Admin key…"
        bind:value={key}
        on:keydown={onKey}
        aria-label="Admin key"
        autocomplete="current-password"
      />
      {#if error}
        <p class="auth-error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748ZM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          {error}
        </p>
      {/if}
    </div>

    <button class="auth-btn" on:click={submit} disabled={checking}>
      {#if checking}
        <svg class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
        Verifying…
      {:else}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
        </svg>
        Unlock
      {/if}
    </button>
  </div>
</div>

<style>
  .auth-wrap {
    min-height: calc(100vh - 4rem);
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    background: var(--background);
  }

  .auth-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 2.5rem 2rem;
    width: 100%; max-width: 380px;
    display: flex; flex-direction: column; gap: 1rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  }

  .auth-icon {
    width: 3.5rem; height: 3.5rem;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: var(--primary); margin: 0 auto;
  }

  .auth-title { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--foreground); }
  .auth-sub   { font-size: 0.875rem; color: var(--muted-foreground); margin: 0; }

  .auth-field { display: flex; flex-direction: column; gap: 0.5rem; }

  .auth-input {
    width: 100%; background: var(--background); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--foreground);
    font-family: var(--font-sans); font-size: 0.9375rem;
    padding: 0.6875rem 0.875rem; outline: none; text-align: center;
    transition: border-color 0.15s; letter-spacing: 0.1em;
  }
  .auth-input:focus { border-color: var(--primary); }

  .auth-error {
    display: flex; align-items: center; justify-content: center; gap: 0.375rem;
    font-size: 0.8125rem; color: var(--destructive); margin: 0;
  }

  .auth-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: var(--primary); color: var(--primary-foreground);
    border: none; border-radius: var(--radius);
    padding: 0.75rem; font-size: 0.9375rem; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s; font-family: var(--font-sans);
  }
  .auth-btn:hover:not(:disabled) { opacity: 0.88; }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
