<script lang="ts">
  import { CI_BASE } from '$lib/nav';

  const packages = [
    {
      name: 'base_types',
      version: '1.0.0',
      desc: 'Common enums (Rarity, ItemType) and helper functions (makeItem, scaledValue) for game item systems.',
      tags: ['game', 'items', 'enums'],
      path: 'mdix_files/tests/imports/base_types.mdix',
      imports: 0,
    },
    {
      name: 'game_helpers',
      version: '1.0.0',
      desc: 'Enemy and loot generation helpers. Imports base_types — transitive import example.',
      tags: ['game', 'enemies', 'loot'],
      path: 'mdix_files/tests/imports/game_helpers.mdix',
      imports: 1,
    },
  ];

  let search = '';
  $: filtered = packages.filter(
    (p) =>
      p.name.includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()))
  );
</script>

<svelte:head><title>DixScript Registry</title></svelte:head>

<div class="reg-wrap">
  <div class="reg-header">
    <h1>Registry</h1>
    <p class="reg-sub">
      Importable <code>.mdix</code> files — use them in your <code>@IMPORTS</code> section.
      This is the early version; a full hosted registry with versioning is planned.
    </p>
  </div>

  <div class="reg-notice">
    <strong>How to use:</strong> Download the file, place it next to your <code>.mdix</code> file,
    then import it: <code>Base from "base_types.mdix"</code>. Access symbols via the alias:
    <code>Base.Rarity.EPIC</code>, <code>Base.makeItem(...)</code>.
  </div>

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
            <div>
              <div class="pkg-name">
                {pkg.name}<span class="pkg-ver">v{pkg.version}</span>
              </div>
              <div class="pkg-desc">{pkg.desc}</div>
            </div>
          </div>

          <div class="pkg-tags">
            {#each pkg.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>

          <div class="pkg-meta">
            {#if pkg.imports > 0}
              <span class="meta-item">↳ {pkg.imports} import{pkg.imports > 1 ? 's' : ''}</span>
            {/if}
            <span class="meta-item">📄 {pkg.path.split('/').pop()}</span>
          </div>

          <div class="pkg-actions">
            <a
              href={`https://raw.githubusercontent.com/Mid-D-Man/DixScript-Rust/master/${pkg.path}`}
              class="action-btn primary"
              target="_blank"
              rel="noopener"
              download
            >
              ⬇ Download
            </a>
            <a
              href={`https://github.com/Mid-D-Man/DixScript-Rust/blob/master/${pkg.path}`}
              class="action-btn"
              target="_blank"
              rel="noopener"
            >
              View Source ↗
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="reg-footer-note">
    Want to contribute an importable <code>.mdix</code> file to the registry? Open a PR to the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener">
      DixScript-Rust repo
    </a>
    adding your file under <code>mdix_files/shared/</code>.
  </div>
</div>

<style>
  .reg-wrap { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-size: 1.8rem; margin-bottom: 8px; }
  .reg-sub { color: var(--muted); font-size: 0.875rem; line-height: 1.6; }
  .reg-header { margin-bottom: 20px; }

  .reg-notice {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;
    font-size: 0.875rem; color: var(--muted); line-height: 1.6;
  }
  .reg-notice strong { color: var(--text); }

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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }
  .pkg-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px;
    display: flex; flex-direction: column; gap: 12px;
    transition: border-color 0.15s;
  }
  .pkg-card:hover { border-color: var(--accent); }
  .pkg-top { display: flex; gap: 12px; }
  .pkg-name {
    font-size: 1rem; font-weight: 700; font-family: var(--font-mono);
    display: flex; align-items: center; gap: 8px;
  }
  .pkg-ver {
    font-size: 0.68rem; background: var(--surface2);
    border: 1px solid var(--border); color: var(--faint);
    padding: 1px 7px; border-radius: 10px; font-family: inherit;
  }
  .pkg-desc { font-size: 0.82rem; color: var(--muted); margin-top: 5px; line-height: 1.5; }

  .pkg-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    font-size: 0.68rem; background: var(--surface2);
    border: 1px solid var(--border2); color: var(--muted);
    padding: 2px 8px; border-radius: 10px;
  }

  .pkg-meta { display: flex; gap: 12px; flex-wrap: wrap; }
  .meta-item { font-size: 0.72rem; color: var(--faint); }

  .pkg-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
  .action-btn {
    display: inline-flex; align-items: center;
    padding: 6px 14px; border-radius: 6px; font-size: 0.80rem; font-weight: 600;
    text-decoration: none; transition: all 0.15s;
    background: var(--surface2); border: 1px solid var(--border); color: var(--muted);
  }
  .action-btn:hover { color: var(--text); border-color: var(--muted); text-decoration: none; }
  .action-btn.primary {
    background: rgba(247, 129, 102, 0.1);
    border-color: rgba(247, 129, 102, 0.4);
    color: var(--accent);
  }
  .action-btn.primary:hover { background: rgba(247, 129, 102, 0.2); }

  .empty { text-align: center; padding: 48px; color: var(--faint); }
  .reg-footer-note {
