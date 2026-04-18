<!-- src/lib/routes/registry/+page.svelte -->
<script lang="ts">
  import RegistryCard    from '$lib/components/registry/RegistryCard.svelte';
  import RegistryFilters from '$lib/components/registry/RegistryFilters.svelte';
  import RegistryModal   from '$lib/components/registry/RegistryModal.svelte';

  const MMS_ACCOUNTS = 'https://mms-accounts.pages.dev';

  export let data: { files: any[]; error: string | null };

  interface Package {
    name:        string;
    path:        string;
    displayName: string;
    size:        number;
    uploaded:    string | null;
    downloadUrl: string;
    desc:        string;
    tags:        string[];
    category:    string;
    addedBy:     string;
    version:     string;
    verifyHash:  string;
  }

  const packages: Package[] = data.files.map((f) => ({
    name:        f.name,
    path:        f.path ?? f.name,
    displayName: f.name.replace('.mdix', ''),
    size:        f.size ?? 0,
    uploaded:    f.uploaded,
    downloadUrl: f.downloadUrl,
    desc:        f.desc        ?? 'Importable .mdix package.',
    tags:        f.tags        ?? ['shared'],
    category:    f.category    ?? 'utils',
    addedBy:     f.addedBy     ?? 'MidManStudio',
    version:     f.version     ?? '1.0.0',
    verifyHash:  f.verifyHash  ?? '',
  }));

  let search         = '';
  let activeCategory = 'all';

  $: filtered = packages.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ = !q
      || p.displayName.toLowerCase().includes(q)
      || p.desc.toLowerCase().includes(q)
      || p.tags.some((t) => t.includes(q));
    return matchCat && matchQ;
  });

  let modalOpen    = false;
  let modalFile    = '';
  let modalContent = '';
  let modalLoading = false;
  let modalError: string | null = null;

  async function openView(filename: string) {
    const pkg = packages.find((p) => p.name === filename);
    if (!pkg) return;

    modalFile = filename; modalContent = ''; modalError = null;
    modalLoading = true; modalOpen = true;

    try {
      const res = await fetch(pkg.downloadUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      modalContent = await res.text();
    } catch (e: any) {
      modalError = e?.message ?? 'Failed to load file';
    } finally {
      modalLoading = false;
    }
  }

  function closeModal() { modalOpen = false; }
</script>

<svelte:head>
  <title>DixScript Registry — Importable Packages</title>
  <meta name="description"
    content="Browse and download importable .mdix packages for DixScript. Game dev, API config, ML pipelines and more." />
</svelte:head>

{#if modalOpen}
  <RegistryModal
    filename={modalFile}
    content={modalContent}
    loading={modalLoading}
    error={modalError}
    on:close={closeModal}
  />
{/if}

<div class="registry-page">

  <!-- Hero -->
  <div class="reg-hero">
    <div class="reg-hero-inner">
      <div class="hero-kicker">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
        </svg>
        Cloud Package Registry
      </div>
      <h1 class="hero-title">DixScript Registry</h1>
      <p class="hero-sub">
        Importable <code>.mdix</code> packages hosted on Cloudflare R2.
        Reference them in your files using <code>from_cloud</code>.
        Click any card to preview its contents. Each package includes a
        SHA-256 verification hash you can copy and verify locally.
      </p>
      <div class="hero-usage">
        <span class="usage-label">Quick Start</span>
        <code class="usage-code">
          Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game/game_helpers.mdix"
        </code>
      </div>
    </div>
  </div>

  <div class="reg-body">

    <!-- MMS Accounts callout -->
    <div class="mms-banner">
      <div class="mms-banner-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div class="mms-banner-body">
        <p class="mms-banner-title">Submit Your Own Packages</p>
        <p class="mms-banner-text">
          Sign in to
          <a href={MMS_ACCOUNTS} target="_blank" rel="noopener noreferrer">
            MmS Accounts
          </a>
          to submit <code>.mdix</code> packages for review. You'll need a
          MidManStudio account and the DixScript Registry service enabled.
          A SHA-256 verification hash is generated automatically during
          submission and shown on the card after approval.
        </p>
        <a href={MMS_ACCOUNTS} class="mms-banner-btn"
           target="_blank" rel="noopener noreferrer">
          Go to MmS Accounts
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
          </svg>
        </a>
      </div>
    </div>

    {#if data.error}
      <div class="notice notice--error">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <span>
          Registry unavailable: {data.error}. See the
          <a href="https://github.com/Mid-D-Man/DixScript-Rust"
             target="_blank" rel="noopener">GitHub repo</a>
          for status.
        </span>
      </div>
    {:else if packages.length === 0}
      <div class="notice notice--info">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>
        <span>
          No packages yet. Submit one via
          <a href={MMS_ACCOUNTS} target="_blank" rel="noopener noreferrer">
            MmS Accounts
          </a>,
          or add <code>.mdix</code> files to <code>registry/</code> in the repo.
        </span>
      </div>
    {/if}

    {#if packages.length > 0}
      <RegistryFilters
        {activeCategory}
        {search}
        totalCount={packages.length}
        filteredCount={filtered.length}
        on:categoryChange={(e) => (activeCategory = e.detail)}
        on:searchChange={(e) => (search = e.detail)}
      />
    {/if}

    {#if filtered.length === 0 && packages.length > 0}
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z"/>
          </svg>
        </div>
        <p class="empty-title">No packages match</p>
        <p class="empty-sub">Try different search terms or switch category.</p>
        <button class="empty-reset"
                on:click={() => { search = ''; activeCategory = 'all'; }}>
          Clear filters
        </button>
      </div>
    {:else if filtered.length > 0}
      <div class="pkg-grid">
        {#each filtered as pkg (pkg.name)}
          <RegistryCard
            name={pkg.name}
            displayName={pkg.displayName}
            description={pkg.desc}
            tags={pkg.tags}
            category={pkg.category}
            size={pkg.size}
            uploaded={pkg.uploaded}
            downloadUrl={pkg.downloadUrl}
            addedBy={pkg.addedBy}
            verifyHash={pkg.verifyHash}
            on:view={(e) => openView(e.detail)}
          />
        {/each}
      </div>
    {/if}

    <div class="reg-footer">
      <div class="reg-footer-inner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             style="flex-shrink:0;color:var(--primary);margin-top:2px">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>
        <div>
          <p>
            To publish via the web, head to
            <a href={MMS_ACCOUNTS} target="_blank" rel="noopener noreferrer">
              MmS Accounts
            </a>
            → Services → Enable DixScript Registry → Registry tab.
            To publish via the repo, add a <code>.mdix</code> +
            <code>.meta.json</code> sidecar to <code>registry/</code> in the
            <a href="https://github.com/Mid-D-Man/DixScript-Rust"
               target="_blank" rel="noopener">DixScript-Rust repo</a>
            and push.
          </p>
          <p class="footer-meta-note">
            The <code>.meta.json</code> sidecar holds description, tags,
            category, author, and the SHA-256 verification hash. The hash
            is generated automatically when submitting via MmS Accounts.
            For repo submissions, generate it with
            <code>sha256sum yourfile.mdix</code> and add it as
            <code>"verifyHash": "..."</code> in the sidecar.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>

<style>
  .registry-page { min-height: calc(100vh - 4rem); background: var(--background); }

  .reg-hero {
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 3rem 1.5rem 2.5rem;
  }
  .reg-hero-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .hero-kicker {
    display: inline-flex; align-items: center; gap: 0.375rem;
    font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--primary);
    background: var(--secondary); border: 1px solid var(--border);
    padding: 0.25rem 0.875rem; border-radius: 9999px;
    width: fit-content; font-family: var(--font-mono);
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700; color: var(--foreground); margin: 0;
  }

  .hero-sub {
    font-size: 1rem;
    color: var(--muted-foreground);
    line-height: 1.75;
    max-width: 680px;
    margin: 0;
  }

  .hero-usage {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: var(--muted); border: 1px solid var(--border);
    border-left: 3px solid var(--primary); border-radius: var(--radius);
    padding: 0.625rem 0.875rem; flex-wrap: wrap;
  }
  .usage-label {
    font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--primary);
    font-family: var(--font-mono); white-space: nowrap; padding-top: 2px;
  }
  .usage-code {
    font-size: 0.8125rem; color: var(--foreground);
    word-break: break-all; background: none; border: none; padding: 0;
  }

  .mms-banner {
    display: flex; align-items: flex-start; gap: 1rem;
    background: var(--card); border: 1px solid var(--border);
    border-left: 3px solid var(--primary); border-radius: 10px;
    padding: 1.25rem 1.5rem;
  }
  .mms-banner-icon {
    width: 2.5rem; height: 2.5rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; color: var(--primary);
  }
  .mms-banner-body { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; min-width: 0; }
  .mms-banner-title {
    font-family: var(--font-serif); font-size: 1rem;
    font-weight: 700; color: var(--foreground); margin: 0;
  }
  .mms-banner-text {
    font-size: 0.875rem; color: var(--muted-foreground);
    line-height: 1.7; margin: 0;
  }
  .mms-banner-text a { color: var(--primary); text-decoration: underline; font-weight: 600; }
  .mms-banner-text code { font-size: 0.8125em; }
  .mms-banner-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: var(--primary); color: var(--primary-foreground);
    border: none; border-radius: var(--radius);
    padding: 0.5rem 1.125rem; font-size: 0.875rem; font-weight: 600;
    text-decoration: none; transition: opacity 0.15s; width: fit-content;
    font-family: var(--font-sans);
  }
  .mms-banner-btn:hover { opacity: 0.88; }

  .reg-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .notice {
    display: flex; align-items: flex-start; gap: 0.625rem;
    padding: 0.875rem 1rem; border-radius: 8px;
    font-size: 0.875rem; line-height: 1.7; border: 1px solid;
  }
  .notice svg { flex-shrink: 0; margin-top: 2px; }
  .notice--error {
    background: rgba(181,74,53,.06); border-color: rgba(181,74,53,.25);
    color: var(--foreground);
  }
  .notice--error svg { color: var(--destructive); }
  .notice--info  {
    background: rgba(166,124,82,.06); border-color: rgba(166,124,82,.25);
    color: var(--foreground);
  }
  .notice--info svg  { color: var(--primary); }
  .notice a { color: var(--primary); text-decoration: underline; }

  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.125rem;
  }

  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.625rem; padding: 4rem 2rem; text-align: center;
  }
  .empty-icon {
    width: 3.5rem; height: 3.5rem; background: var(--secondary);
    border: 1px solid var(--border); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted-foreground); margin-bottom: 0.5rem;
  }
  .empty-title {
    font-family: var(--font-serif); font-size: 1.125rem;
    font-weight: 700; color: var(--foreground);
  }
  .empty-sub { font-size: 0.875rem; color: var(--muted-foreground); }
  .empty-reset {
    margin-top: 0.5rem; background: var(--primary);
    color: var(--primary-foreground); border: none;
    border-radius: var(--radius); padding: 0.5rem 1.25rem;
    font-size: 0.875rem; font-weight: 600; cursor: pointer;
    transition: opacity 0.15s;
  }
  .empty-reset:hover { opacity: 0.85; }

  .reg-footer { border-top: 1px solid var(--border); padding-top: 1.5rem; }
  .reg-footer-inner {
    display: flex; gap: 0.875rem; align-items: flex-start;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 1rem 1.25rem;
    font-size: 0.875rem; color: var(--muted-foreground); line-height: 1.7;
  }
  .reg-footer-inner p { margin: 0; }
  .reg-footer-inner p + p { margin-top: 0.5rem; }
  .reg-footer-inner a { color: var(--primary); text-decoration: underline; }
  .footer-meta-note { font-size: 0.8125rem; opacity: 0.8; }

  @media (max-width: 640px) {
    .reg-hero  { padding: 2rem 1rem 1.5rem; }
    .reg-body  { padding: 1.25rem 1rem 2rem; }
    .pkg-grid  { grid-template-columns: 1fr; }
    .mms-banner { flex-direction: column; }
  }
</style>
