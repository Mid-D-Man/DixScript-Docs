<!-- src/lib/components/FeaturesSection.svelte -->
<script lang="ts">
  const features = [
    {
      title: 'Deduplication Engine',
      description:
        'User-defined QuickFuncs compress repetitive data at compile time. Define a structure once, reuse it everywhere. Game configs: 68%+ smaller. More repetition means more savings.',
      highlight: '~makeItem(id, name, type, rarity, value)',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    },
    {
      title: 'QuickFuncs: Programmable Config',
      description:
        'Write small functions that run at compile time, not at runtime. Compute derived values, enforce structure, and fan out repeated patterns without adding another scripting layer.',
      highlight: '~service(name, image, port, replicas)',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"/></svg>`,
    },
    {
      title: 'Two-Tier Data Model',
      description:
        'Flat properties for simple settings, table and group syntax for structured data. Keep small configs minimal while still modelling complex schemas when you need them.',
      highlight: 'properties: → groups:: → arrays::',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"/></svg>`,
    },
    {
      title: 'Built-in Encryption & Compression',
      description:
        'Use DLM modules to chain compression and encryption in the same file. Ship encrypted secrets, compressed datasets, or both — without extra build tooling.',
      highlight: '@DLM(DCompressor.gzip, DEncryptor.aes256)',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>`,
    },
    {
      title: 'Enums & Types When You Want Them',
      description:
        'Add enums and explicit types where strictness matters, keep everything inferred when it doesn\'t. Readable configs that still catch mistakes before they hit production.',
      highlight: 'Environment { DEV, STAGING, PROD }',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/></svg>`,
    },
    {
      title: 'Zero-Dependency Core',
      description:
        'A pure Rust core with FFI bindings for C#, Go, Java, Python, and WebAssembly. Use the same .mdix file across services and languages without pulling in a heavyweight runtime.',
      highlight: 'Rust · C# · Go · Java · Python · WASM',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>`,
    },
  ];

  const useCases: { label: string; href: string }[] = [
    { label: 'Game Dev',          href: '/docs#quickfuncs'  },
    { label: 'API Services',      href: '/docs#config'      },
    { label: 'Multi-Environment', href: '/docs#enums'       },
    { label: 'ML Pipelines',      href: '/docs#data'        },
    { label: 'E-Commerce',        href: '/docs#quickfuncs'  },
    { label: 'Encrypted Bundles', href: '/docs#dlm'         },
    { label: 'CLI Tools',         href: '/docs#cli'         },
    { label: 'Embedded',          href: '/docs#ffi'         },
  ];
</script>

<section class="features" id="features">
  <div class="features-inner">

    <div class="section-header">
      <h2>Powerful Features Built-In</h2>
      <p>
        The more repetitive your configs, the more you gain by factoring patterns into QuickFuncs.
      </p>
    </div>

    <div class="feature-grid">
      {#each features as feature}
        <div class="feature-card">
          <div class="feature-icon" aria-hidden="true">
            {@html feature.icon}
          </div>
          <h3 class="feature-title">{feature.title}</h3>
          <p class="feature-desc">{feature.description}</p>
          <div class="feature-highlight">
            <code>{feature.highlight}</code>
          </div>
        </div>
      {/each}
    </div>

    <div class="why-block">
      <h3>Why DixScript?</h3>
      <p>
        If changing one field means editing it in more than three places today,
        DixScript helps you pull that pattern into one reusable definition.
      </p>
      <ul class="why-list">
        {#each [
          'Multi-environment configs that mostly differ by URLs, credentials, and flags',
          'API services sharing the same retry, timeout, and logging policies',
          'Feature flags and experiment configs duplicated across clients and backends',
          'Secrets stored separately from the config that actually uses them',
        ] as item}
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <div class="use-cases">
      <h3 class="use-cases-title">Perfect For</h3>
      <p class="use-cases-sub">
        Configs that have grown beyond simple key-value files but don't deserve a full application
        just to keep them maintainable.
      </p>
      <div class="use-cases-grid">
        {#each useCases as { label, href }}
          <a {href} class="use-case-chip">{label}</a>
        {/each}
      </div>
    </div>

    <div class="status-note">
      <div class="status-note-inner">
        <div class="status-heading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          <strong>Under Active Development</strong>
        </div>
        <p>
          DixScript is not yet production-ready. The Rust port targets performance and portability,
          while the original C# implementation serves as the current reference.
        </p>
        <div class="status-links">
          <a href="https://github.com/Mid-D-Man/DixScript" target="_blank" rel="noopener noreferrer" class="status-link">C# Prototype ↗</a>
          <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer" class="status-link">Rust Source ↗</a>
          <a href="/results" class="status-link">CI Results</a>
          <a href="/docs" class="status-link">Docs</a>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .features { padding: 5rem 1.5rem; background: var(--background); }

  .features-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .section-header { text-align: center; max-width: 680px; margin: 0 auto; }
  .section-header h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 0.75rem; }
  .section-header p { font-size: 1rem; color: var(--muted-foreground); line-height: 1.75; }

  .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }

  .feature-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .feature-card:hover { border-color: var(--primary); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); }

  .feature-icon {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    flex-shrink: 0;
  }

  .feature-title { font-family: var(--font-serif); font-size: 1.0625rem; font-weight: 700; color: var(--foreground); }
  .feature-desc  { font-size: 0.875rem; color: var(--muted-foreground); line-height: 1.75; flex: 1; }

  .feature-highlight { margin-top: auto; }
  .feature-highlight code {
    display: inline-block;
    font-size: 0.71875rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    color: var(--primary);
    word-break: break-all;
  }

  .why-block {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 2rem;
  }

  .why-block h3 { font-size: 1.375rem; margin-bottom: 0.75rem; }
  .why-block p { font-size: 0.9375rem; color: var(--muted-foreground); line-height: 1.75; margin-bottom: 1rem; max-width: 700px; }

  .why-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .why-list li {
    font-size: 0.9375rem;
    color: var(--foreground);
    padding-left: 1.375rem;
    position: relative;
    line-height: 1.6;
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding-left: 0;
  }
  .why-list li svg { color: var(--primary); flex-shrink: 0; margin-top: 4px; }

  .use-cases { border-top: 1px solid var(--border); padding-top: 2.5rem; text-align: center; }
  .use-cases-title { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.625rem; color: var(--foreground); }
  .use-cases-sub { font-size: 0.9375rem; color: var(--muted-foreground); max-width: 560px; margin: 0 auto 1.25rem; line-height: 1.7; }

  .use-cases-grid { display: flex; flex-wrap: wrap; gap: 0.625rem; justify-content: center; }

  .use-case-chip {
    display: inline-flex;
    align-items: center;
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--foreground);
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .use-case-chip:hover { background: var(--secondary); border-color: var(--primary); color: var(--primary); }

  .status-note {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .status-note-inner { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.625rem; }

  .status-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    color: var(--foreground);
  }

  .status-note p { font-size: 0.875rem; color: var(--muted-foreground); line-height: 1.7; max-width: 640px; }

  .status-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }

  .status-link { font-size: 0.875rem; font-weight: 600; color: var(--primary); text-decoration: none; transition: opacity 0.15s ease; }
  .status-link:hover { opacity: 0.75; text-decoration: underline; }

  @media (max-width: 1024px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .features { padding: 3rem 1rem; } .feature-grid { grid-template-columns: 1fr; } .why-block { padding: 1.25rem; } }
</style>
