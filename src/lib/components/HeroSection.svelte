<script lang="ts">
  // No script needed — static section
</script>

<section class="hero">

  <!-- Decorative background blobs -->
  <div class="blob blob-1" aria-hidden="true"></div>
  <div class="blob blob-2" aria-hidden="true"></div>

  <div class="hero-inner">

    <!-- Badge -->
    <div class="badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      Under Active Development
    </div>

    <!-- Headline -->
    <h1 class="headline">
      The Swiss Army Knife<br />
      <span class="headline-accent">of Data Formats</span>
    </h1>

    <!-- Sub-headline -->
    <p class="subheadline">
      Config, Code, and Crypto in One <code>.mdix</code> File
    </p>

    <!-- Quote -->
    <p class="quote">
      <em>"I built this because I was tired of copy-pasting the same JSON config blocks 500 times."</em>
    </p>

    <!-- Description -->
    <p class="description">
      DixScript is a programmable configuration format that learns from repetition.
      Game configs reduced by 68%+, multi-environment setups simplified, all with
      built-in encryption and compression — zero dependencies.
    </p>

    <!-- CTA Buttons -->
    <div class="cta-row">
      <a href="/playground" class="btn btn-primary">
        Try Playground
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <a href="/docs" class="btn btn-secondary">Read Docs</a>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat">
        <div class="stat-value">68%+</div>
        <div class="stat-label">Size Reduction</div>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat">
        <div class="stat-value">One File</div>
        <div class="stat-label">Config + Logic + Encryption</div>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat">
        <div class="stat-value">Zero Deps</div>
        <div class="stat-label">Pure Rust + FFI Bindings</div>
      </div>
    </div>

  </div>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    background: var(--background);
    padding: 5rem 1.5rem 4rem;
    text-align: center;
  }

  /* Decorative background blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.07;
    pointer-events: none;
  }

  .blob-1 {
    width: 600px;
    height: 600px;
    background: var(--primary);
    top: -200px;
    left: -100px;
  }

  .blob-2 {
    width: 500px;
    height: 500px;
    background: var(--accent);
    bottom: -150px;
    right: -50px;
  }

  /* ── Content ── */
  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  /* ── Badge ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
  }

  /* ── Headline ── */
  .headline {
    font-family: var(--font-serif);
    font-size: clamp(2.25rem, 6vw, 4rem);
    font-weight: 700;
    color: var(--foreground);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .headline-accent {
    color: var(--primary);
  }

  /* ── Subheadline ── */
  .subheadline {
    font-family: var(--font-serif);
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: var(--muted-foreground);
    line-height: 1.5;
  }

  /* ── Quote ── */
  .quote {
    font-size: 1rem;
    color: var(--muted-foreground);
    font-style: italic;
    max-width: 620px;
    line-height: 1.7;
  }

  /* ── Description ── */
  .description {
    font-size: 1rem;
    color: var(--foreground);
    max-width: 600px;
    line-height: 1.75;
  }

  /* ── CTA ── */
  .cta-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius);
    font-family: var(--font-sans);
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .btn-primary:hover {
    opacity: 0.88;
  }

  .btn-secondary {
    background: var(--card);
    color: var(--foreground);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--secondary);
  }

  /* ── Stats ── */
  .stats-grid {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat {
    text-align: center;
    flex-shrink: 0;
  }

  .stat-value {
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }

  .stat-divider {
    width: 1px;
    height: 2.5rem;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .hero {
      padding: 3rem 1rem 2.5rem;
    }

    .stat-divider {
      display: none;
    }

    .stats-grid {
      gap: 1.5rem;
    }

    .cta-row {
      flex-direction: column;
      width: 100%;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
