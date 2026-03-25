<script lang="ts">
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features',   href: '/#features'  },
        { label: 'Playground', href: '/playground' },
        { label: 'Registry',   href: '/registry'   },
        { label: 'CI Results', href: '/results'    },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs'                                               },
        { label: 'Quick Start',   href: '/docs#quickstart'                                    },
        { label: 'C# Prototype',  href: 'https://github.com/Mid-D-Man/DixScript',  external: true },
        { label: 'Rust Source',   href: 'https://github.com/Mid-D-Man/DixScript-Rust', external: true },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'GitHub',  href: 'https://github.com/Mid-D-Man/DixScript-Rust', external: true },
        { label: 'Issues',  href: 'https://github.com/Mid-D-Man/DixScript-Rust/issues', external: true },
      ],
    },
  ];
</script>

<footer class="footer">
  <div class="footer-inner">

    <!-- Brand column -->
    <div class="brand-col">
      <div class="brand">
        <div class="brand-icon">D</div>
        <span class="brand-name">DixScript</span>
      </div>
      <p class="tagline">The Swiss Army Knife of Data Formats.</p>
      <p class="status-note">⚠️ Under active development — not production ready.</p>
    </div>

    <!-- Link columns -->
    {#each columns as col}
      <div class="link-col">
        <h3 class="col-title">{col.title}</h3>
        <ul class="link-list">
          {#each col.links as link}
            <li>
              
                href={link.href}
                class="footer-link"
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                {link.label}{link.external ? ' ↗' : ''}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}

  </div>

  <!-- Bottom bar -->
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <p class="copyright">© {year} DixScript — MidManStudio. MIT License.</p>
      <div class="social-links">
        
          href="https://github.com/Mid-D-Man/DixScript-Rust"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          aria-label="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.955.005 1.917.128 2.805.374 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--secondary);
    border-top: 1px solid var(--border);
    margin-top: auto;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1.5rem 2rem;
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 2rem;
  }

  /* ── Brand column ── */
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .brand-icon {
    width: 2rem;
    height: 2rem;
    background: var(--accent);
    color: var(--accent-foreground);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .brand-name {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--foreground);
  }

  .tagline {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    margin-bottom: 0.5rem;
  }

  .status-note {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    opacity: 0.8;
  }

  /* ── Link columns ── */
  .col-title {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 1rem;
  }

  .link-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-link {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    transition: color 0.15s ease;
  }

  .footer-link:hover {
    color: var(--foreground);
  }

  /* ── Bottom bar ── */
  .footer-bottom {
    border-top: 1px solid var(--border);
  }

  .footer-bottom-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .copyright {
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }

  .social-links {
    display: flex;
    gap: 0.5rem;
  }

  .social-link {
    padding: 0.375rem;
    color: var(--muted-foreground);
    border-radius: var(--radius);
    transition: color 0.15s ease, background 0.15s ease;
    line-height: 0;
    display: flex;
    align-items: center;
  }

  .social-link:hover {
    color: var(--foreground);
    background: var(--muted);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .footer-inner {
      grid-template-columns: 1fr 1fr;
    }

    .brand-col {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 560px) {
    .footer-inner {
      grid-template-columns: 1fr;
    }
  }
</style>
