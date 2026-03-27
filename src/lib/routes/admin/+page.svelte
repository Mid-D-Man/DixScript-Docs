<!-- src/lib/routes/admin/+page.svelte -->
<script lang="ts">
  import AdminAuth        from '$lib/components/admin/AdminAuth.svelte';
  import AdminUploadForm  from '$lib/components/admin/AdminUploadForm.svelte';
  import AdminPackageRow  from '$lib/components/admin/AdminPackageRow.svelte';

  let adminKey = '';
  let unlocked = false;

  type Pkg = {
    name: string; path: string; category: string; size: number;
    uploaded: string | null; desc: string; addedBy: string; version: string;
  };

  let packages: Pkg[] = [];
  let loadError = '';
  let loading   = false;
  let activeTab: 'packages' | 'upload' = 'packages';

  function onUnlock(e: CustomEvent<string>) {
    adminKey = e.detail;
    unlocked = true;
    loadPackages();
  }

  async function loadPackages() {
    loading = true; loadError = '';
    try {
      const res = await fetch('/api/admin/list', {
        headers: { Authorization: `Bearer ${adminKey}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      packages = data.files ?? [];
    } catch (e: any) {
      loadError = e?.message ?? 'Failed to load packages';
    } finally {
      loading = false;
    }
  }

  async function handleDelete(e: CustomEvent<string>) {
    const path = e.detail;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      packages = packages.filter(p => p.path !== path);
    } catch (e: any) {
      loadError = `Delete failed: ${e?.message}`;
    }
  }

  function onUploaded() {
    activeTab = 'packages';
    loadPackages();
  }

  function signOut() {
    adminKey = ''; unlocked = false; packages = [];
  }
</script>

<svelte:head>
  <title>DixScript Admin</title>
</svelte:head>

{#if !unlocked}
  <AdminAuth on:unlock={onUnlock} />
{:else}
  <div class="admin-page">

    <!-- Header -->
    <div class="admin-header">
      <div class="admin-header-left">
        <div class="admin-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
          </svg>
          Admin
        </div>
        <h1 class="admin-title">Registry Dashboard</h1>
        <p class="admin-sub">Manage the DixScript package registry.</p>
      </div>
      <button class="sign-out-btn" on:click={signOut}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
        </svg>
        Sign out
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num">{packages.length}</div>
        <div class="stat-label">Total Packages</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{[...new Set(packages.map(p => p.category))].length}</div>
        <div class="stat-label">Categories</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{packages.reduce((acc, p) => acc + p.size, 0) > 0 ? (packages.reduce((acc, p) => acc + p.size, 0) / 1024).toFixed(1) + ' KB' : '—'}</div>
        <div class="stat-label">Total Size</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" class:active={activeTab === 'packages'} on:click={() => activeTab = 'packages'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
        </svg>
        Packages ({packages.length})
      </button>
      <button class="tab" class:active={activeTab === 'upload'} on:click={() => activeTab = 'upload'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
        </svg>
        Upload New
      </button>
    </div>

    <!-- Tab content -->
    {#if activeTab === 'packages'}
      <div class="packages-panel">
        <div class="panel-toolbar">
          <span class="panel-title">All Packages</span>
          <button class="refresh-btn" on:click={loadPackages} disabled={loading}>
            <svg class:spin={loading} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
            Refresh
          </button>
        </div>

        {#if loadError}
          <div class="panel-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748ZM12 15.75h.007v.008H12v-.008z"/>
            </svg>
            {loadError}
          </div>
        {/if}

        {#if loading}
          <div class="panel-loading">
            <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
            Loading packages…
          </div>
        {:else if packages.length === 0}
          <div class="panel-empty">No packages in registry yet. Upload one to get started.</div>
        {:else}
          <div class="package-list">
            {#each packages as pkg (pkg.path)}
              <AdminPackageRow
                name={pkg.name}
                path={pkg.path}
                category={pkg.category}
                size={pkg.size}
                uploaded={pkg.uploaded}
                desc={pkg.desc}
                addedBy={pkg.addedBy}
                version={pkg.version}
                on:delete={handleDelete}
              />
            {/each}
          </div>
        {/if}
      </div>

    {:else}
      <AdminUploadForm {adminKey} on:uploaded={onUploaded} />
    {/if}

  </div>
{/if}

<style>
  .admin-page {
    max-width: 1100px; margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    display: flex; flex-direction: column; gap: 1.5rem;
  }

  /* Header */
  .admin-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap;
  }
  .admin-header-left { display: flex; flex-direction: column; gap: 0.375rem; }

  .admin-badge {
    display: inline-flex; align-items: center; gap: 0.375rem;
    font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--primary);
    background: var(--secondary); border: 1px solid var(--border);
    padding: 0.25rem 0.75rem; border-radius: 9999px;
    width: fit-content; font-family: var(--font-mono);
  }

  .admin-title { font-family: var(--font-serif); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: var(--foreground); margin: 0; }
  .admin-sub   { font-size: 0.875rem; color: var(--muted-foreground); margin: 0; }

  .sign-out-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    font-size: 0.875rem; font-weight: 600;
    background: var(--card); border: 1px solid var(--border);
    color: var(--muted-foreground); padding: 0.5rem 1rem;
    border-radius: var(--radius); cursor: pointer;
    transition: all 0.15s; font-family: var(--font-sans);
  }
  .sign-out-btn:hover { background: var(--secondary); color: var(--foreground); }

  /* Stats */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
  }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.25rem; text-align: center;
  }
  .stat-num   { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: var(--primary); }
  .stat-label { font-size: 0.8125rem; color: var(--muted-foreground); margin-top: 0.25rem; }

  /* Tabs */
  .tabs {
    display: flex; gap: 0.25rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0;
  }
  .tab {
    display: inline-flex; align-items: center; gap: 0.375rem;
    padding: 0.625rem 1rem;
    font-size: 0.875rem; font-weight: 600;
    border: none; background: none; cursor: pointer;
    color: var(--muted-foreground);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s; font-family: var(--font-sans);
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .tab:hover { color: var(--foreground); background: var(--muted); }
  .tab.active { color: var(--primary); border-bottom-color: var(--primary); background: none; }

  /* Packages panel */
  .packages-panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden;
  }

  .panel-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.875rem 1.125rem; border-bottom: 1px solid var(--border);
    background: var(--secondary);
  }
  .panel-title { font-size: 0.875rem; font-weight: 700; color: var(--foreground); }

  .refresh-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    font-size: 0.8125rem; font-weight: 600;
    background: var(--card); border: 1px solid var(--border);
    color: var(--muted-foreground); padding: 0.375rem 0.75rem;
    border-radius: var(--radius); cursor: pointer;
    transition: all 0.15s; font-family: var(--font-sans);
  }
  .refresh-btn:hover { background: var(--muted); color: var(--foreground); }
  .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .panel-error {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.125rem; font-size: 0.875rem;
    color: var(--destructive); background: rgba(181,74,53,.05);
    border-bottom: 1px solid var(--border);
  }

  .panel-loading {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    padding: 3rem; color: var(--muted-foreground); font-size: 0.875rem;
  }

  .panel-empty {
    padding: 3rem; text-align: center;
    font-size: 0.875rem; color: var(--muted-foreground);
  }

  .package-list { }

  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .admin-page { padding: 1.25rem 1rem; }
    .stats-row  { grid-template-columns: 1fr; }
  }
</style>
