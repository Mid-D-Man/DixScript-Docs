<script lang="ts">
  const features = [
    {
      icon: '⚡',
      title: 'Deduplication Engine',
      description:
        'User-defined QuickFuncs compress repetitive data at compile time. Define a structure once, reuse it everywhere. Game configs: 68%+ smaller. More repetition means more savings.',
      highlight: 'Game config: 68% reduction',
    },
    {
      icon: '⌛',
      title: 'QuickFuncs: Programmable Config',
      description:
        'Write small functions that run at compile time, not at runtime. Compute derived values, enforce structure, and fan out repeated patterns without adding another scripting layer to your stack.',
      highlight: '~service(name, image, port, replicas)',
    },
    {
      icon: '🗂️',
      title: 'Two-Tier Data Model',
      description:
        'Flat properties for simple settings, table and group syntax for structured data. Keep small configs minimal while still being able to model complex schemas when you need them.',
      highlight: 'properties: then groups:: then arrays::',
    },
    {
      icon: '🔒',
      title: 'Built-in Encryption and Compression',
      description:
        'Use DLM modules to chain compression and encryption in the same file. Ship encrypted secrets, compressed datasets, or both — without extra build tooling.',
      highlight: '@DLM(DCompressor.gzip, DEncryptor.aes256)',
    },
    {
      icon: '📌',
      title: 'Enums and Types When You Want Them',
      description:
        'Add enums and explicit types where strictness matters, keep everything inferred when it doesn\'t. Readable configs that still catch mistakes before they hit production.',
      highlight: 'Environment { DEV, STAGING, PROD }',
    },
    {
      icon: '🦀',
      title: 'Zero-Dependency Core',
      description:
        'A pure Rust core with FFI bindings for C#, Go, Java, Python, and WebAssembly. Use the same .mdix file across services and languages without pulling in a heavyweight runtime.',
      highlight: 'Rust · C# · Go · Java · Python · WASM',
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

    <!-- Header -->
    <div class="section-header">
      <h2>Powerful Features Built-In</h2>
      <p>
        A programmable configuration format that turns repeated config into reusable building blocks.
        The more repetitive your configs, the more you gain by factoring patterns into QuickFuncs.
      </p>
    </div>

    <!-- Feature cards -->
    <div class="feature-grid">
      {#each features as feature}
        <div class="feature-card">
          <div class="feature-icon" aria-hidden="true">{feature.icon}</div>
          <h3 class="feature-title">{feature.title}</h3>
          <p class="feature-desc">{feature.description}</p>
          <div class="feature-highlight">
            <code>{feature.highlight}</code>
          </div>
        </div>
      {/each}
    </div>

    <!-- Why DixScript blurb -->
    <div class="why-block">
      <h3>Why DixScript?</h3>
      <p>
        A programmable configuration format that lets you factor repetition into functions.
        If changing one field means editing it in more than three places today,
        DixScript helps you pull that pattern into one reusable definition.
      </p>
      <ul class="why-list">
        <li>Multi-environment configs that mostly differ by URLs, credentials, and flags</li>
        <li>API services sharing the same retry, timeout, and logging policies</li>
        <li>Feature flags and experiment configs duplicated across clients and backends</li>
        <li>Secrets stored separately from the config that actually uses them</li>
      </ul>
    </div>

    <!-- Use cases -->
    <div class="use-cases">
      <h3 class="use-cases-title">Perfect For</h3>
      <p class="use-cases-sub">
        DixScript is designed for configs that have grown beyond simple key-value files
        but don't deserve a full application just to keep them maintainable.
      </p>
      <div class="use-cases-grid">
        {#each useCases as { label, href }}
          <a {href} class="use-case-chip">{label}</a>
        {/each}
      </div>
    </div>

    <!-- Dev status note -->
    <div class="status-note">
      <div class="status-note-inner">
        <div class="status-heading">
          <span class="status-icon">⚠️</span>
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
          <a href="/playground" class="status-link">Playground</a>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .features {
    padding: 5rem 1.5rem;
    background: var(--background);
  }

  .features-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  /* ── Header ── */
  .section-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto;
  }

  .section-header h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin-bottom: 0.75rem;
  }

  .section-header p {
    font-size: 1rem;
    color: var(--muted-foreground);
    line-height: 1.75;
  }

  /* ── Feature Grid ── */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

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

  .feature-card:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }

  .feature-icon {
    font-size: 1.75rem;
    line-height: 1;
  }

  .feature-title {
    font-family: var(--font-serif);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--foreground);
  }

  .feature-desc {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    line-height: 1.75;
    flex: 1;
  }

  .feature-highlight {
    margin-top: auto;
  }

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

  /* ── Why Block ── */
  .why-block {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 2rem;
  }

  .why-block h3 {
    font-size: 1.375rem;
    margin-bottom: 0.75rem;
  }

  .why-block p {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.75;
    margin-bottom: 1rem;
    max-width: 700px;
  }

  .why-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .why-list li {
    font-size: 0.9375rem;
    color: var(--foreground);
    padding-left: 1.25rem;
    position: relative;
    line-height: 1.6;
  }

  .why-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 600;
  }

  /* ── Use Cases ── */
  .use-cases {
    border-top: 1px solid var(--border);
    padding-top: 2.5rem;
    text-align: center;
  }

  .use-cases-title {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.625rem;
    color: var(--foreground);
  }

  .use-cases-sub {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    max-width: 560px;
    margin: 0 auto 1.25rem;
    line-height: 1.7;
  }

  .use-cases-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    justify-content: center;
  }

  /* <a> tags styled as chips */
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
    cursor: pointer;
  }

  .use-case-chip:hover {
    background: var(--secondary);
    border-color: var(--primary);
    color: var(--primary);
  }

  /* ── Dev Status ── */
  .status-note {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .status-note-inner {
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .status-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    color: var(--foreground);
  }

  .status-icon {
    font-size: 1rem;
  }

  .status-note p {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    line-height: 1.7;
    max-width: 640px;
  }

  .status-links {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .status-link {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary);
    text-decoration: none;
    transition: opacity 0.15s ease;
  }

  .status-link:hover {
    opacity: 0.75;
    text-decoration: underline;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .feature-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .features {
      padding: 3rem 1rem;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }

    .why-block {
      padding: 1.25rem;
    }
  }
</style>
