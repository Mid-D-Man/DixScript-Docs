<!-- src/lib/components/HeroSection.svelte -->
<script lang="ts">
  // Static section
</script>

<section class="hero">
  <div class="blob blob-1" aria-hidden="true"></div>
  <div class="blob blob-2" aria-hidden="true"></div>

  <div class="hero-inner">

    <!-- Dev badge -->
    <div class="badge">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
      </svg>
      Under Active Development
    </div>

    <!-- Headline -->
    <h1 class="headline">
      The Swiss Army Knife<br />
      <span class="headline-accent">of Data Formats</span>
    </h1>

    <!-- Sub-headline -->
    <p class="subheadline">Config, Code, and Crypto in One&nbsp;<code>.mdix</code>&nbsp;File</p>

    <!-- Value prop -->
    <p class="strapline">
      A programmable configuration format that lets you factor repetition into functions.
      Define patterns once, reuse them everywhere — with built-in encryption and compression, zero dependencies.
    </p>

    <!-- CTAs -->
    <div class="cta-row">
      <a href="/playground" class="btn btn-primary">
        Try Playground
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
        </svg>
      </a>
      <a href="/docs" class="btn btn-secondary">Read the Docs</a>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat">
        <div class="stat-value">68%+</div>
        <div class="stat-label">Size reduction on real-world configs</div>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat">
        <div class="stat-value">One File</div>
        <div class="stat-label">Config + logic + encryption</div>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat">
        <div class="stat-value">Zero Deps</div>
        <div class="stat-label">Pure Rust core with FFI bindings</div>
      </div>
    </div>

    <!-- Quote -->
    <blockquote class="quote">
      <p>
        "I built this because I was tired of copy-pasting the same JSON config blocks 500 times.
        Turns out other people hate that too."
      </p>
      <footer>— Mid-D-Man, Creator</footer>
    </blockquote>

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

  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
  }

  .headline {
    font-family: var(--font-serif);
    font-size: clamp(2.25rem, 6vw, 4rem);
    font-weight: 700;
    color: var(--foreground);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .headline-accent { color: var(--primary); }

  .subheadline {
    font-family: var(--font-serif);
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: var(--muted-foreground);
  }

  .strapline {
    font-size: 1rem;
    color: var(--muted-foreground);
    max-width: 560px;
    line-height: 1.75;
  }

  .cta-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 0.25rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius);
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-primary { background: var(--primary); color: var(--primary-foreground); }
  .btn-primary:hover { opacity: 0.88; }
  .btn-secondary { background: var(--card); color: var(--foreground); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--secondary); }

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

  .stat { text-align: center; flex-shrink: 0; }

  .stat-value {
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }

  .stat-label { font-size: 0.8125rem; color: var(--muted-foreground); max-width: 160px; line-height: 1.4; }
  .stat-divider { width: 1px; height: 2.5rem; background: var(--border); flex-shrink: 0; }

  .quote {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    max-width: 600px;
    text-align: left;
    font-style: italic;
  }

  .quote p { font-size: 0.9375rem; color: var(--foreground); line-height: 1.7; margin-bottom: 0.5rem; }
  .quote footer { font-size: 0.8125rem; color: var(--muted-foreground); font-style: normal; font-weight: 600; }

  @media (max-width: 640px) {
    .hero { padding: 3rem 1rem 2.5rem; }
    .stat-divider { display: none; }
    .stats-grid { gap: 1.5rem; }
    .cta-row { flex-direction: column; width: 100%; }
    .btn { width: 100%; justify-content: center; }
  }
</style>
