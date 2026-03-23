<script lang="ts">
  export let data: { files: any[]; error: string | null };

  interface Package {
    name: string;
    displayName: string;
    size: number;
    uploaded: string | null;
    downloadUrl: string;
    desc: string;
    tags: string[];
  }

  // Metadata map — add an entry here whenever you upload a new .mdix to R2
  const meta: Record<string, { desc: string; tags: string[] }> = {
    'base_types.mdix': {
      desc: 'Common enums (Rarity, ItemType) and helper functions (makeItem, scaledValue) for game item systems.',
      tags: ['game', 'items', 'enums']
    },
    'game_helpers.mdix': {
      desc: 'Enemy and loot generation helpers. Imports base_types — transitive import example.',
      tags: ['game', 'enemies', 'loot']
    }
  };

  const packages: Package[] = data.files.map((f) => ({
    name: f.name,
    displayName: f.name.replace('.mdix', ''),
    size: f.size,
    uploaded: f.uploaded,
    downloadUrl: f.downloadUrl,
    desc: meta[f.name]?.desc ?? 'Importable .mdix package.',
    tags: meta[f.name]?.tags ?? ['shared']
  }));

  let search = '';
  $: filtered = packages.filter(
    (p) =>
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()))
  );

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head><title>DixScript Registry</title></svelte:head>

<div class="reg-wrap">
  <div class="reg-header">
    <h1>Registry</h1>
    <p class="reg-sub">
      Importable <code>.mdix</code> files hosted on Cloudflare R2.
      Reference them in your <code>@IMPORTS</code> section using <code>from_cloud</code>.
    </p>
  </div>

  {#if data.error}
    <div class="notice error">⚠️ {data.error} — showing 0 packages.</div>
  {:else if packages.length === 0}
    <div class="notice warn">
      No packages uploaded yet. Add <code>.mdix</code> files to the
      <code>registry/</code> folder in the repo and push — the sync
      workflow will upload them automatically.
    </div>
  {:else}
    <div class="notice info">
      <strong>How to use:</strong> Copy the URL from any package below and use it in your file:
      <code>Base from_cloud "https://dixscript-docs.pages.dev/api/registry/base_types.mdix"</code>
    </div>
  {/if}

  {#if packages.length > 0}
    <div class="search-row">
      <input
        class="search-box"
        type="text"
        placeholder="Search packages…"
        bind:value={search}
      />
      <span class="pkg-count">{filtered.length} package{filtered.length !== 1 ? 's' : ''}</span>
    </div>

    {#if filtered.length === 0}
      <div class="empty">No packages match "{search}"</div>
    {:else}
      <div class="pkg-grid">
        {#each filtered as pkg}
          <div class="pkg-card">
            <div class="pkg-top">
              <div class="pkg-name">
                {pkg.displayName}
                <span class="pkg-ext">.mdix</span>
              </div>
              <div class="pkg-desc">{pkg.desc}</div>
            </div>

            <div class="pkg-tags">
              {#each pkg.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>

            <div class="pkg-meta">
              <span class="meta-item">📦 {formatSize(pkg.size)}</span>
              <span class="meta-item">📅 {formatDate(pkg.uploaded)}</span>
            </div>

            <div class="import-snippet">
              <span class="snip-label">Import URL</span>
              <code class="snip-url">https://dixscript-docs.pages.dev{pkg.downloadUrl}</code>
            </div>

            <div class="pkg-actions">
              <a
                href={pkg.downloadUrl}
                class="action-btn primary"
                target="_blank"
                rel="noopener"
                download
              >
                ⬇ Download
              </a>
              <button
                class="action-btn"
                on:click={() =>
                  navigator.clipboard.writeText(
                    `https://dixscript-docs.pages.dev${pkg.downloadUrl}`
                  )}
              >
                📋 Copy URL
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  <div class="reg-footer-note">
    Want to add a package? Drop a <code>.mdix</code> file into the
    <code>registry/</code> folder in the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener">
      DixScript-Rust repo
    </a>
    and push. The sync workflow uploads it to R2 automatically.
  </div>
</div>
<style>
  .reg-wrap { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-size: 1.8rem; margin-bottom: 8px; }
  .reg-sub { color: var(--muted); font-size: 0.875rem; line-height: 1.6; }
  .reg-header { margin-bottom: 20px; }

  .notice {
    border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;
    font-size: 0.875rem; line-height: 1.6;
  }
  .notice.info    { background: rgba(88,166,255,.06);   border: 1px solid rgba(88,166,255,.2);   color: var(--blue);   }
  .notice.warn    { background: rgba(227,179,65,.06);   border: 1px solid rgba(227,179,65,.2);   color: var(--yellow); }
  .notice.error   { background: rgba(248,81,73,.06);    border: 1px solid rgba(248,81,73,.2);    color: #f85149;       }
  .notice strong  { color: var(--text); }

  .search-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .search-box {
    flex: 1; background: var(--surface); border: 1px solid var(--border);
    color: var(--text); padding: 8px 14px; border-radius: 8px;
    font-size: 0.875rem; outline: none; transition: border-color 0.15s;
  }
  .search-box:focus { border-color: var(--accent); }
  .search-box::placeholder { color: var(--faint); }
  .pkg-count { font-size: 0.80rem; color: var(--faint); white-space: nowrap; }

  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
  }
  .pkg-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px;
    display: flex; flex-direction: column; gap: 12px;
    transition: border-color 0.15s;
  }
  .pkg-card:hover { border-color: var(--accent); }

  .pkg-name {
    font-size: 1rem; font-weight: 700; font-family: var(--font-mono);
    display: flex; align-items: center; gap: 4px; margin-bottom: 6px;
  }
  .pkg-ext { color: var(--faint); font-weight: 400; }
  .pkg-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.5; }

  .pkg-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    font-size: 0.68rem; background: var(--surface2);
    border: 1px solid var(--border2); color: var(--muted);
    padding: 2px 8px; border-radius: 10px;
  }

  .pkg-meta { display: flex; gap: 14px; }
  .meta-item { font-size: 0.72rem; color: var(--faint); }

  .import-snippet {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 6px; padding: 8px 12px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .snip-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--faint); }
  .snip-url {
    font-size: 0.72rem; color: var(--blue); word-break: break-all;
    background: none; border: none; padding: 0;
  }

  .pkg-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .action-btn {
    display: inline-flex; align-items: center;
    padding: 6px 14px; border-radius: 6px; font-size: 0.80rem; font-weight: 600;
    text-decoration: none; transition: all 0.15s; cursor: pointer;
    background: var(--surface2); border: 1px solid var(--border); color: var(--muted);
  }
  .action-btn:hover { color: var(--text); border-color: var(--muted); text-decoration: none; }
  .action-btn.primary {
    background: rgba(247,129,102,.1);
    border-color: rgba(247,129,102,.4);
    color: var(--accent);
  }
  .action-btn.primary:hover { background: rgba(247,129,102,.2); }

  .empty { text-align: center; padding: 48px; color: var(--faint); }
  .reg-footer-note {
    margin-top: 32px; padding-top: 20px;
    border-top: 1px solid var(--border2);
    font-size: 0.82rem; color: var(--faint); line-height: 1.6;
  }
</style>
