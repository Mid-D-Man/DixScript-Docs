<!-- src/lib/components/admin/AdminUploadForm.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let adminKey: string;

  const dispatch = createEventDispatcher<{ uploaded: void }>();

  let fileInput: HTMLInputElement;
  let selectedFile: File | null = null;
  let category = 'game';
  let desc = '';
  let tags = '';
  let version = '1.0.0';
  let addedBy = 'MidManStudio';
  let verifyHash = '';

  let status: 'idle' | 'uploading' | 'done' | 'error' = 'idle';
  let errorMsg = '';
  let successMsg = '';

  const CATEGORIES = ['game', 'ml', 'api', 'crypto', 'ecommerce', 'utils'];

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedFile = input.files?.[0] ?? null;
    if (selectedFile && !selectedFile.name.endsWith('.mdix')) {
      selectedFile = null;
      errorMsg = 'Only .mdix files are accepted.';
    } else {
      errorMsg = '';
    }
  }

  async function upload() {
    if (!selectedFile) { errorMsg = 'Select a .mdix file first.'; return; }
    if (!desc.trim())  { errorMsg = 'Description is required.'; return; }
    errorMsg = ''; status = 'uploading';

    const form = new FormData();
    form.append('file',        selectedFile);
    form.append('category',    category);
    form.append('desc',        desc.trim());
    form.append('tags',        tags);
    form.append('version',     version.trim());
    form.append('addedBy',     addedBy.trim());
    if (verifyHash.trim()) form.append('verifyHash', verifyHash.trim());

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminKey}` },
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      successMsg = `Uploaded: ${data.path}`;
      status = 'done';
      selectedFile = null;
      desc = ''; tags = ''; version = '1.0.0'; verifyHash = '';
      if (fileInput) fileInput.value = '';
      dispatch('uploaded');
    } catch (e: any) {
      errorMsg = e?.message ?? 'Upload failed';
      status = 'error';
    }
  }
</script>

<div class="form-wrap">
  <h2 class="form-title">Upload Package</h2>
  <p class="form-sub">Upload a <code>.mdix</code> file. A <code>.meta.json</code> sidecar is created automatically from the fields below.</p>

  <div class="form-grid">

    <!-- File picker -->
    <div class="field field--full">
      <label class="field-label" for="upload-file">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
        </svg>
        .mdix File
        <span class="required">*</span>
      </label>
      <div class="file-zone" on:click={() => fileInput?.click()} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && fileInput?.click()}>
        {#if selectedFile}
          <div class="file-selected">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            {selectedFile.name}
            <span class="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        {:else}
          <div class="file-prompt">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
            <span>Click to select .mdix file</span>
          </div>
        {/if}
        <input bind:this={fileInput} type="file" accept=".mdix" on:change={onFileChange} class="file-input" />
      </div>
    </div>

    <!-- Category -->
    <div class="field">
      <label class="field-label" for="upload-cat">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
        </svg>
        Category <span class="required">*</span>
      </label>
      <select id="upload-cat" class="field-select" bind:value={category}>
        {#each CATEGORIES as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>

    <!-- Version -->
    <div class="field">
      <label class="field-label" for="upload-ver">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"/>
        </svg>
        Version
      </label>
      <input id="upload-ver" type="text" class="field-input" bind:value={version} placeholder="1.0.0" />
    </div>

    <!-- Added by -->
    <div class="field">
      <label class="field-label" for="upload-by">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
        </svg>
        Added By
      </label>
      <input id="upload-by" type="text" class="field-input" bind:value={addedBy} placeholder="MidManStudio" />
    </div>

    <!-- Tags -->
    <div class="field field--full">
      <label class="field-label" for="upload-tags">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/>
        </svg>
        Tags <span class="hint">(comma-separated)</span>
      </label>
      <input id="upload-tags" type="text" class="field-input" bind:value={tags} placeholder="rpg, enums, quickfuncs" />
    </div>

    <!-- Description -->
    <div class="field field--full">
      <label class="field-label" for="upload-desc">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/>
        </svg>
        Description <span class="required">*</span>
      </label>
      <textarea id="upload-desc" class="field-textarea" bind:value={desc} placeholder="What does this package provide?" rows="3"></textarea>
    </div>

    <!-- Verify hash (optional) -->
    <div class="field field--full">
      <label class="field-label" for="upload-hash">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
        </svg>
        Verify Hash <span class="hint">(optional — sha256:…)</span>
      </label>
      <input id="upload-hash" type="text" class="field-input" bind:value={verifyHash} placeholder="sha256:abc123def456…" />
    </div>

  </div>

  {#if errorMsg}
    <div class="msg msg--error">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748ZM12 15.75h.007v.008H12v-.008z"/>
      </svg>
      {errorMsg}
    </div>
  {/if}
  {#if successMsg}
    <div class="msg msg--success">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
      </svg>
      {successMsg}
    </div>
  {/if}

  <button class="upload-btn" on:click={upload} disabled={status === 'uploading'}>
    {#if status === 'uploading'}
      <svg class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
      </svg>
      Uploading…
    {:else}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
      </svg>
      Upload Package
    {/if}
  </button>
</div>

<style>
  .form-wrap {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.75rem;
    display: flex; flex-direction: column; gap: 1.25rem;
  }

  .form-title { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--foreground); }
  .form-sub   { font-size: 0.875rem; color: var(--muted-foreground); margin: 0; line-height: 1.6; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .field { display: flex; flex-direction: column; gap: 0.375rem; }
  .field--full { grid-column: 1 / -1; }

  .field-label {
    display: flex; align-items: center; gap: 0.375rem;
    font-size: 0.8125rem; font-weight: 600; color: var(--foreground);
    font-family: var(--font-sans);
  }
  .required { color: var(--destructive); }
  .hint     { font-weight: 400; color: var(--muted-foreground); font-size: 0.75rem; }

  .field-input, .field-select, .field-textarea {
    background: var(--background); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--foreground);
    font-family: var(--font-sans); font-size: 0.875rem;
    padding: 0.5rem 0.75rem; outline: none; width: 100%;
    transition: border-color 0.15s;
  }
  .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: var(--primary); }
  .field-textarea { resize: vertical; min-height: 72px; }

  .file-zone {
    background: var(--background); border: 1px dashed var(--border);
    border-radius: var(--radius); padding: 1.25rem;
    cursor: pointer; transition: border-color 0.15s;
    text-align: center;
  }
  .file-zone:hover { border-color: var(--primary); }

  .file-prompt {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: var(--muted-foreground); font-size: 0.875rem;
  }

  .file-selected {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    color: var(--primary); font-family: var(--font-mono); font-size: 0.875rem; font-weight: 600;
  }
  .file-size { color: var(--muted-foreground); font-weight: 400; }

  .file-input { display: none; }

  .msg {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.625rem 0.875rem; border-radius: var(--radius);
    font-size: 0.875rem; border: 1px solid;
  }
  .msg--error   { background: rgba(181,74,53,.06); border-color: rgba(181,74,53,.25); color: var(--destructive); }
  .msg--success { background: rgba(63,185,80,.06);  border-color: rgba(63,185,80,.25);  color: #2a8a3a; }

  .upload-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: var(--primary); color: var(--primary-foreground);
    border: none; border-radius: var(--radius);
    padding: 0.75rem 1.5rem; font-size: 0.9375rem; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s; font-family: var(--font-sans);
    align-self: flex-start;
  }
  .upload-btn:hover:not(:disabled) { opacity: 0.88; }
  .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .form-grid { grid-template-columns: 1fr; }
  }
</style>
