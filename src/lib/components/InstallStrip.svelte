<!-- src/lib/components/InstallStrip.svelte -->
<script lang="ts">
  interface Target {
    label: string;
    registry: string;
    cmd: string;
    href: string;
    published: boolean;
    note?: string;
  }

  const targets: Target[] = [
    { label: 'Rust (core)',  registry: 'crates.io', cmd: 'cargo add dixscript',                         href: 'https://crates.io/crates/dixscript',                 published: true },
    { label: 'CLI',          registry: 'crates.io', cmd: 'cargo install mdix-cli',                        href: 'https://crates.io/crates/mdix-cli',                  published: true },
    { label: 'LSP',          registry: 'crates.io', cmd: 'cargo install mdix-lsp',                        href: 'https://crates.io/crates/mdix-lsp',                  published: true },
    { label: 'Node / Browser', registry: 'npm',     cmd: 'npm install @midmanstudio/mdix',                href: 'https://www.npmjs.com/package/@midmanstudio/mdix',  published: true },
    { label: 'Python',       registry: 'PyPI',      cmd: 'pip install midmanstudio-mdix',                 href: 'https://pypi.org/project/midmanstudio-mdix/',        published: true },
    { label: 'C# / Unity',   registry: 'NuGet',     cmd: 'dotnet add package MidManStudio.Mdix',          href: 'https://www.nuget.org/packages/MidManStudio.Mdix',  published: true },
    { label: 'VS Code',      registry: 'Open VSX',  cmd: 'search "DixScript"',                            href: 'https://open-vsx.org/extension/midmanstudio/dixscript', published: true, note: 'Not yet on the VS Code Marketplace' },
  ];
</script>

<section class="install-strip">
  <div class="install-inner">
    <div class="install-head">
      <h2>Published Now</h2>
      <a href="/docs#ffi" class="install-all-link">Full language / platform status →</a>
    </div>

    <div class="install-grid">
      {#each targets as t}
        <a class="install-card" href={t.href} target="_blank" rel="noopener noreferrer">
          <div class="install-card-top">
            <span class="install-label">{t.label}</span>
            <span class="install-registry">{t.registry}</span>
          </div>
          <code class="install-cmd">{t.cmd}</code>
          {#if t.note}
            <span class="install-note">{t.note}</span>
          {/if}
        </a>
      {/each}
    </div>

    <p class="install-footnote">
      Go, Java/Kotlin, Lua, PHP, and Odin bindings are code-complete and bind to the
      same Rust core — they just haven't had their publishing pass yet. Build them
      from source in the meantime, or see
      <a href="/docs#ffi">Language Bindings</a> for exact status per wrapper.
    </p>
  </div>
</section>

<style>
  .install-strip {
    background: var(--secondary);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 2.5rem 1.5rem;
  }

  .install-inner { max-width: 1000px; margin: 0 auto; }

  .install-head {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem;
  }
  .install-head h2 {
    font-family: var(--font-serif);
    font-size: 1.375rem; font-weight: 700; color: var(--foreground); margin: 0;
  }
  .install-all-link {
    font-size: 0.8125rem; font-weight: 600; color: var(--primary);
    text-decoration: none; white-space: nowrap;
  }
  .install-all-link:hover { text-decoration: underline; }

  .install-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
  }

  .install-card {
    display: flex; flex-direction: column; gap: 0.375rem;
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 0.875rem;
    text-decoration: none; transition: border-color 0.15s;
  }
  .install-card:hover { border-color: var(--primary); }

  .install-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .install-label { font-size: 0.8125rem; font-weight: 700; color: var(--foreground); }
  .install-registry {
    font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--primary); background: rgba(166,124,82,.1); border: 1px solid rgba(166,124,82,.3);
    padding: 0.1rem 0.45rem; border-radius: 9999px; flex-shrink: 0;
  }

  .install-cmd {
    font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted-foreground);
    background: var(--muted); border-radius: 4px; padding: 0.3rem 0.5rem;
    overflow-x: auto; white-space: pre;
  }

  .install-note { font-size: 0.6875rem; color: var(--muted-foreground); font-style: italic; }

  .install-footnote {
    margin: 1.25rem 0 0; font-size: 0.8125rem; color: var(--muted-foreground); line-height: 1.7;
    max-width: 720px;
  }
  .install-footnote a { color: var(--primary); text-decoration: underline; }

  @media (max-width: 640px) {
    .install-strip { padding: 1.75rem 1rem; }
  }
</style>
