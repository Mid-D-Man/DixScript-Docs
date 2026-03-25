<script lang="ts">
  const features = [
    {
      icon: '⚡',
      title: 'Deduplication Engine',
      description:
        'Intelligent pattern recognition compresses repetitive data at compile time. Game configs: 68%+ smaller. More repetition means more savings.',
      highlight: 'Game config: 68% reduction',
    },
    {
      icon: '⌛',
      title: 'Programmable via QuickFuncs',
      description:
        'Write compile-time functions once, use everywhere. Values computed at parse time, zero runtime overhead.',
      highlight: '~createEnemy(name, hp, dmg)',
    },
    {
      icon: '🔒',
      title: '5 DLM Modules',
      description:
        'Data Lifecycle Management: DCompressor (gzip/bzip2/lzma), DAuditor, DEncryptor (xor/aes128/aes256/chacha20), plus DIY.',
      highlight: '@DLM(DCompressor.gzip, DEncryptor.aes256)',
    },
    {
      icon: '📌',
      title: 'Immutable by Default',
      description:
        'let, const, and let mut keywords with compile-time safety. Variable declarations prevent accidental mutations.',
      highlight: 'const PI = 3.14; let mut x = 0',
    },
    {
      icon: '🦀',
      title: 'Zero Dependencies',
      description:
        'Pure Rust core with FFI bindings for C#, Go, Java, Python, PHP, and WASM. Embed anywhere with no external libraries.',
      highlight: 'Just works™',
    },
    {
      icon: '🌐',
      title: 'Import System & Verification',
      description:
        'Modular config with cloud imports, local includes, and SHA256 hash verification. Circular dependencies detected at compile time.',
      highlight: 'utils from "lib.mdix" verify "sha256:..."',
    },
  ];

  const useCases = [
    'Game Dev', 'Web3 Configs', 'API Services', 'ML Pipelines',
    'E-Commerce', 'Enterprise', 'CLI Tools', 'Embedded',
  ];
</script>

<section class="features" id="features">
  <div class="features-inner">

    <!-- Header -->
    <div class="section-header">
      <h2>Powerful Features Built-In</h2>
      <p>
        A programmable configuration format that learns from your data.
        The more repetitive your configs, the more DixScript optimises them.
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

    <!-- Use cases -->
    <div class="use-cases">
      <h3 class="use-cases-title">Perfect For</h3>
      <div class="use-cases-grid">
        {#each useCases as use}
          <div class="use-case-chip">{use}</div>
        {/each}
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
    max-width: 600px;
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
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }

  .feature-icon {
    font-size: 1.75rem;
    line-height: 1;
  }

  .feature-title {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--foreground);
  }

  .feature-desc {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    line-height: 1.7;
    flex: 1;
  }

  .feature-highlight {
    margin-top: auto;
  }

  .feature-highlight code {
    display: inline-block;
    font-size: 0.75rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    color: var(--primary);
    word-break: break-all;
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
    margin-bottom: 1.25rem;
    color: var(--foreground);
  }

  .use-cases-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .use-case-chip {
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--foreground);
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    transition: background 0.15s ease, border-color 0.15s ease;
    cursor: default;
  }

  .use-case-chip:hover {
    background: var(--secondary);
    border-color: var(--primary);
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
  }
</style>
