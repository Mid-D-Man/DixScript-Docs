<!-- src/lib/routes/results/+page.svelte -->
<script lang="ts">
  import CICard     from '$lib/components/ci/CICard.svelte';
  import CICategory from '$lib/components/ci/CICategory.svelte';
  import { CI_BASE } from '$lib/nav';

  // Icon paths (heroicons)
  const ICONS = {
    code:    'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
    term:    'M8.25 9.75h4.875a2.625 2.625 0 0 1 0 5.25H12M8.25 9.75 10.5 7.5M8.25 9.75 10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z',
    chart:   'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z',
    flame:   'M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48z',
    puzzle:  'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0z',
    link:    'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
    snake:   'M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z',
    cube:    'M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    cog:     'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  };
</script>

<svelte:head>
  <title>DixScript CI Results</title>
  <meta name="description" content="Test results, benchmarks and flamegraphs from the DixScript-Rust CI pipeline." />
</svelte:head>

<div class="results-page">

  <!-- Hero -->
  <div class="results-hero">
    <div class="results-hero-inner">
      <div class="hero-kicker">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
        </svg>
        CI Pipeline
      </div>
      <h1 class="hero-title">CI Results</h1>
      <p class="hero-sub">
        All test reports, benchmarks, and flamegraphs deployed to GitHub Pages
        automatically from the <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener">DixScript-Rust</a> CI pipeline.
      </p>
    </div>
  </div>

  <div class="results-body">

    <!-- Trigger notice -->
    <div class="trigger-notice">
      <div class="trigger-notice-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>
      </div>
      <div>
        <p class="trigger-title">Commit keyword triggers</p>
        <div class="trigger-chips">
          {#each ['--publish-tests', '--publish-bench', '--publish-flame', '--publish-cli', '--mdix-special', '--mdix-py', '--publish-all'] as kw}
            <code class="trigger-chip">{kw}</code>
          {/each}
        </div>
      </div>
    </div>

    <!-- Core Rust -->
    <CICategory label="Core Rust" iconPath={ICONS.code}>
      <CICard
        title="Unit & Integration Tests"
        desc="dixscript core, mdix-cli, and mdix-lsp — unit and integration test suite with coverage reporting."
        href="{CI_BASE}/tests/"
        lang="rust"
        iconPath={ICONS.code}
      />
      <CICard
        title="CLI Tests"
        desc="mdix command tests across all subcommands and fixture files. Validates compile, validate, inspect, convert."
        href="{CI_BASE}/cli/"
        lang="rust"
        iconPath={ICONS.term}
      />
      <CICard
        title="Criterion Benchmarks"
        desc="Lexer, parser, serialization, and runtime benchmarks tracked across commits."
        href="{CI_BASE}/bench/"
        lang="bench"
        iconPath={ICONS.chart}
      />
      <CICard
        title="Flamegraphs"
        desc="perf + cargo-flamegraph CPU profiles for all benchmark targets. Find hotspots visually."
        href="{CI_BASE}/flame/"
        lang="bench"
        iconPath={ICONS.flame}
      />
      <CICard
        title="Edge Cases & DLM"
        desc="Import resolution, circular detection, DLM pipeline, binary serialization, and special case capture."
        href="{CI_BASE}/edge/"
        lang="test"
        iconPath={ICONS.puzzle}
      />
    </CICategory>

    <!-- Language Wrappers -->
    <CICategory label="Language Wrappers" iconPath={ICONS.cube}>
      <CICard
        title="Python Bindings"
        desc="midmanstudio-mdix PyO3 / maturin wheel build and test suite."
        href="{CI_BASE}/python/"
        lang="python"
        iconPath={ICONS.snake}
      />
      <CICard
        title="Go Bindings"
        desc="mdix-go cgo FFI binding build and test suite."
        href="{CI_BASE}/go/"
        lang="go"
        iconPath={ICONS.cube}
      />
      <CICard
        title="Java Bindings"
        desc="mdix-java JNI binding build and test suite."
        href="{CI_BASE}/java/"
        lang="java"
        iconPath={ICONS.cube}
      />
      <CICard
        title="PHP Bindings"
        desc="midmanstudio/mdix PHP FFI extension build and test suite."
        href="{CI_BASE}/php/"
        lang="php"
        iconPath={ICONS.cube}
      />
      <CICard
        title="C# / FFI Builds"
        desc="MidManStudio.Mdix NuGet package native library builds across target platforms."
        href="{CI_BASE}/ffi/"
        lang="cs"
        iconPath={ICONS.link}
      />
    </CICategory>

    <!-- Dashboard link -->
    <div class="dashboard-link-wrap">
      <a href={CI_BASE} class="dashboard-link" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
        </svg>
        View Full CI Dashboard on GitHub Pages
      </a>
    </div>

  </div>
</div>

<style>
  .results-page { min-height: calc(100vh - 4rem); background: var(--background); }

  /* Hero */
  .results-hero { background: var(--card); border-bottom: 1px solid var(--border); padding: 3rem 1.5rem 2.5rem; }
  .results-hero-inner { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.875rem; }

  .hero-kicker {
    display: inline-flex; align-items: center; gap: 0.375rem;
    font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--primary); background: var(--secondary); border: 1px solid var(--border);
    padding: 0.25rem 0.875rem; border-radius: 9999px; width: fit-content; font-family: var(--font-mono);
  }

  .hero-title {
    font-family: var(--font-serif); font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700; color: var(--foreground); margin: 0;
  }

  .hero-sub { font-size: 1rem; color: var(--muted-foreground); line-height: 1.7; max-width: 620px; margin: 0; }
  .hero-sub a { color: var(--primary); text-decoration: underline; }

  /* Body */
  .results-body { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 3rem; display: flex; flex-direction: column; gap: 2.5rem; }

  /* Trigger notice */
  .trigger-notice {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.125rem 1.25rem;
  }
  .trigger-notice-icon {
    width: 2rem; height: 2rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    color: var(--primary); margin-top: 2px;
  }
  .trigger-title { font-size: 0.875rem; font-weight: 700; color: var(--foreground); margin: 0 0 0.625rem; }
  .trigger-chips { display: flex; flex-wrap: wrap; gap: 0.375rem; }
  .trigger-chip {
    font-size: 0.75rem; background: var(--secondary);
    border: 1px solid var(--border); padding: 0.2rem 0.625rem;
    border-radius: var(--radius); font-family: var(--font-mono); color: var(--primary);
  }

  /* Dashboard link */
  .dashboard-link-wrap { padding-top: 0.5rem; }
  .dashboard-link {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--card); border: 1px solid var(--border);
    color: var(--foreground); padding: 0.75rem 1.5rem; border-radius: var(--radius);
    font-size: 0.9375rem; font-weight: 600; text-decoration: none;
    transition: all 0.15s; font-family: var(--font-sans);
  }
  .dashboard-link:hover { border-color: var(--primary); color: var(--primary); background: var(--secondary); }

  @media (max-width: 640px) {
    .results-hero { padding: 2rem 1rem 1.5rem; }
    .results-body { padding: 1.25rem 1rem; }
  }
</style>
