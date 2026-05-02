<!-- src/lib/components/registry/RegistryCard.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let name: string;
  export let displayName: string;
  export let description: string;
  export let tags: string[];
  export let category: string;
  export let size: number;
  export let uploaded: string | null;
  export let downloadUrl: string;
  export let addedBy: string = 'MidManStudio';
  export let verifyHash: string = '';

  const dispatch = createEventDispatcher<{ view: string }>();

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  function formatDate(iso: string | null): string {
    if (!iso) return 'Unknown';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const catColorClass: Record<string, string> = {
    game:       'chip--game',
    ml:         'chip--ml',
    api:        'chip--api',
    crypto:     'chip--crypto',
    ecommerce:  'chip--ecommerce',
    utils:      'chip--utils',
  };

  // Category display labels matching mms-accounts
  const catLabels: Record<string, string> = {
    game:       'Game Dev',
    ml:         'ML / AI',
    api:        'API Config',
    crypto:     'Crypto',
    ecommerce:  'E-Commerce',
    utils:      'Utilities',
  };

  let urlCopied  = false;
  let hashCopied = false;

  async function copyText(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    }
  }

  async function copyUrl(e: MouseEvent) {
    e.stopPropagation();
    const url = `https://dixscript-docs.pages.dev${downloadUrl}`;
    if (await copyText(url)) {
      urlCopied = true;
      setTimeout(() => (urlCopied = false), 2000);
    }
  }

  async function copyHash(e: MouseEvent) {
    e.stopPropagation();
    if (await copyText(verifyHash)) {
      hashCopied = true;
      setTimeout(() => (hashCopied = false), 2000);
    }
  }

  function stopProp(e: MouseEvent) { e.stopPropagation(); }
</script>

<button class="reg-card" on:click={() => dispatch('view', name)} aria-label="View {displayName}.mdix">

  <!-- Head -->
  <div class="card-head">
    <div class="card-name-row">
      <div class="card-file-icon" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
        </svg>
      </div>
      <div class="card-name-block">
        <span class="card-name">{displayName}</span><span class="card-ext">.mdix</span>
      </div>
    </div>
    <span class="cat-chip {catColorClass[category] ?? 'chip--utils'}">
      {catLabels[category] ?? category}
    </span>
  </div>

  <!-- Description -->
  <p class="card-desc">{description}</p>

  <!-- Tags -->
  {#if tags.length > 0}
    <div class="card-tags">
      {#each tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {/if}

  <!-- Meta -->
  <div class="card-meta">
    <span class="meta-item">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
      </svg>
      {formatSize(size)}
    </span>
    <span class="meta-item">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
      </svg>
      {formatDate(uploaded)}
    </span>
    <span class="meta-item meta-author">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      {addedBy}
    </span>
  </div>

  <!-- from_cloud URL snippet -->
  <div class="import-snippet">
    <span class="snippet-label">from_cloud URL</span>
    <code class="snippet-url">https://dixscript-docs.pages.dev{downloadUrl}</code>
  </div>

  <!-- SHA-256 verification hash — always shown when present, prominent -->
  {#if verifyHash}
    <div class="hash-block">
      <div class="hash-header">
        <div class="hash-label-row">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
          </svg>
          <span class="hash-label-text">SHA-256 Verification Hash</span>
        </div>
        <button
          class="hash-copy-btn"
          on:click={copyHash}
          aria-label="Copy SHA-256 hash"
        >
          {#if hashCopied}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            Copied!
          {:else}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
            </svg>
            Copy Hash
          {/if}
        </button>
      </div>
      <code class="hash-value">{verifyHash}</code>
      <p class="hash-usage">
        Use with <code>verify "sha256:{verifyHash.slice(0, 8)}…"</code> in your @IMPORTS block
      </p>
    </div>
  {:else}
    <div class="hash-block hash-block--missing">
      <div class="hash-label-row">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <span class="hash-label-text hash-label-text--missing">No verification hash</span>
      </div>
      <p class="hash-missing-note">This package was uploaded before hash verification was added.</p>
    </div>
  {/if}

  <!-- Footer actions -->
  <div class="card-footer">
    <span class="click-hint">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      Click to view source
    </span>
    <div class="card-actions">
      <button class="action-btn action-btn--copy" on:click={copyUrl} aria-label="Copy URL">
        {#if urlCopied}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
          </svg>
          Copied
        {:else}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
          </svg>
          Copy URL
        {/if}
      </button>
      <a
        class="action-btn action-btn--dl"
        href={downloadUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        on:click={stopProp}
        aria-label="Download"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
        </svg>
        Download
      </a>
    </div>
  </div>

</button>

<style>
  .reg-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.375rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    font-family: var(--font-sans);
  }
  .reg-card:hover { border-color: var(--primary); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .reg-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

  /* Head */
  .card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.625rem; }
  .card-name-row { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
  .card-file-icon {
    width: 1.875rem; height: 1.875rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    color: var(--primary);
  }
  .card-name-block { display: flex; align-items: baseline; flex-wrap: wrap; }
  .card-name { font-family: var(--font-mono); font-size: 0.9375rem; font-weight: 700; color: var(--foreground); }
  .card-ext  { font-family: var(--font-mono); font-size: 0.9375rem; color: var(--muted-foreground); }

  .cat-chip {
    font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; padding: 0.2rem 0.625rem; border-radius: 9999px;
    white-space: nowrap; flex-shrink: 0; font-family: var(--font-mono); border: 1px solid;
  }
  .chip--game      { background: rgba(166,124,82,.12); color: var(--primary);         border-color: rgba(166,124,82,.35); }
  .chip--ml        { background: rgba(88,166,255,.10); color: #4d82c4;                border-color: rgba(88,166,255,.3);  }
  .chip--api       { background: rgba(63,185,80,.10);  color: #2e8a41;                border-color: rgba(63,185,80,.3);   }
  .chip--crypto    { background: rgba(181,74,53,.10);  color: var(--destructive);      border-color: rgba(181,74,53,.3);   }
  .chip--ecommerce { background: rgba(200,155,50,.10); color: #8a6a1a;                border-color: rgba(200,155,50,.3);  }
  .chip--utils     { background: var(--secondary);     color: var(--muted-foreground); border-color: var(--border);       }

  .card-desc { font-size: 0.875rem; color: var(--muted-foreground); line-height: 1.7; margin: 0; }

  .card-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
  .tag {
    font-size: 0.6875rem; background: var(--secondary);
    border: 1px solid var(--border); color: var(--muted-foreground);
    padding: 0.1875rem 0.625rem; border-radius: var(--radius);
    font-family: var(--font-mono);
  }

  .card-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .meta-item {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.75rem; color: var(--muted-foreground); font-family: var(--font-mono);
  }
  .meta-author { color: var(--primary); font-weight: 600; }

  /* Import snippet */
  .import-snippet {
    background: var(--muted); border: 1px solid var(--border);
    border-radius: 6px; padding: 0.5rem 0.75rem;
    display: flex; flex-direction: column; gap: 0.25rem;
  }
  .snippet-label {
    font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--primary); font-family: var(--font-mono); font-weight: 700;
  }
  .snippet-url {
    font-size: 0.6875rem; color: var(--foreground); word-break: break-all;
    background: none; border: none; padding: 0; font-family: var(--font-mono);
  }

  /* Hash block */
  .hash-block {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: 6px;
    padding: 0.625rem 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .hash-block--missing {
    border-left-color: var(--muted-foreground);
    opacity: 0.6;
  }

  .hash-header {
    display: flex; align-items: center;
    justify-content: space-between; gap: 0.5rem;
  }

  .hash-label-row {
    display: flex; align-items: center; gap: 0.35rem;
  }

  .hash-label-text {
    font-size: 0.625rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--primary); font-family: var(--font-mono);
  }

  .hash-label-text--missing { color: var(--muted-foreground); }

  .hash-copy-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.6875rem; font-family: var(--font-mono);
    color: var(--muted-foreground);
    background: var(--card); border: 1px solid var(--border);
    border-radius: 4px; padding: 0.2rem 0.5rem;
    cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .hash-copy-btn:hover { color: var(--primary); border-color: var(--primary); }

  .hash-value {
    font-family: var(--font-mono); font-size: 0.6rem;
    color: var(--foreground); word-break: break-all;
    background: none; border: none; padding: 0;
    line-height: 1.5; opacity: 0.8;
    display: block;
  }

  .hash-usage {
    font-size: 0.6875rem; color: var(--muted-foreground);
    line-height: 1.5; margin: 0;
  }
  .hash-usage code {
    font-family: var(--font-mono); font-size: 0.6875rem;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 3px; padding: 0.1rem 0.3rem;
    color: var(--primary);
  }

  .hash-missing-note {
    font-size: 0.6875rem; color: var(--muted-foreground); margin: 0; line-height: 1.5;
  }

  /* Footer */
  .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-top: auto; }

  .click-hint {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.75rem; color: var(--muted-foreground); font-style: italic; opacity: 0.7;
  }

  .card-actions { display: flex; gap: 0.375rem; }
  .action-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.375rem 0.75rem; border-radius: var(--radius);
    font-size: 0.8125rem; font-weight: 600; cursor: pointer;
    border: 1px solid var(--border); text-decoration: none;
    transition: all 0.15s; background: var(--card);
    color: var(--foreground); font-family: var(--font-sans);
  }
  .action-btn:hover { background: var(--secondary); border-color: var(--primary); color: var(--primary); }
  .action-btn--dl { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
  .action-btn--dl:hover { opacity: 0.85; color: var(--primary-foreground); background: var(--primary); }
</style>
