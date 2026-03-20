<script lang="ts">
  import { CI_BASE } from '$lib/nav';

  const categories = [
    {
      group: 'Core Rust',
      items: [
        { icon: '🦀', title: 'Rust Tests',        desc: 'dixscript core, mdix-cli, mdix-lsp unit and integration tests',  href: `${CI_BASE}/tests/`,  badge: 'rust'  },
        { icon: '🖥️', title: 'CLI Tests',          desc: 'mdix command tests across all subcommands and fixture files',   href: `${CI_BASE}/cli/`,    badge: 'rust'  },
        { icon: '📊', title: 'Benchmarks',         desc: 'Criterion benchmarks — lexer, parser, serialization, runtime',  href: `${CI_BASE}/bench/`,  badge: 'rust'  },
        { icon: '🔥', title: 'Flamegraphs',        desc: 'perf + cargo-flamegraph profile for all bench targets',         href: `${CI_BASE}/flame/`,  badge: 'rust'  },
        { icon: '🔬', title: 'Edge Cases & DLM',   desc: 'Imports, cyclic detection, DLM pipeline, binary serialization capture', href: `${CI_BASE}/edge/`, badge: 'test' },
      ]
    },
    {
      group: 'Language Wrappers',
      items: [
        { icon: '🐍', title: 'Python Tests', desc: 'midmanstudio-mdix PyO3/maturin wheel tests', href: `${CI_BASE}/python/`, badge: 'python' },
        { icon: '🔵', title: 'Go Tests',     desc: 'mdix-go cgo FFI binding tests',              href: `${CI_BASE}/go/`,     badge: 'go'     },
        { icon: '☕', title: 'Java Tests',   desc: 'mdix-java JNI binding tests',                href: `${CI_BASE}/java/`,   badge: 'java'   },
        { icon: '🐘', title: 'PHP Tests',    desc: 'midmanstudio/mdix PHP FFI tests',            href: `${CI_BASE}/php/`,    badge: 'php'    },
        { icon: '🔗', title: 'FFI Builds',   desc: 'C# NuGet mdix-ffi native library builds',   href: `${CI_BASE}/ffi/`,    badge: 'cs'     },
      ]
    }
  ];
</script>

<svelte:head><title>DixScript CI Results</title></svelte:head>

<div class="results-wrap">
  <div class="results-header">
    <h1>CI Results</h1>
    <p class="results-sub">All test results, benchmarks, and flamegraphs deployed to GitHub Pages from the <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener">DixScript-Rust</a> CI pipeline.</p>
  </div>

  <div class="ci-notice">
    Results update automatically on each CI run. Trigger specific pipelines by including keywords in your commit message: <code>--publish-tests</code>, <code>--publish-bench</code>, <code>--publish-flame</code>, <code>--publish-cli</code>, <code>--mdix-special</code>, <code>--mdix-py</code>, or <code>--publish-all</code>.
  </div>

  {#each categories as cat}
    <div class="cat-section">
      <div class="cat-label">{cat.group}</div>
      <div class="results-grid">
        {#each cat.items as item}
          <a class="result-card" href={item.href} target="_blank" rel="noopener">
            <div class="rc-icon">{item.icon}</div>
            <div class="rc-body">
              <div class="rc-title">{item.title}</div>
              <div class="rc-desc">{item.desc}</div>
            </div>
            <span class="lang-chip {item.badge}" style="margin-top:auto;align-self:flex-start">{item.badge === 'test' ? 'Special' : item.badge.toUpperCase()}</span>
            <div class="rc-arrow">↗</div>
          </a>
        {/each}
      </div>
    </div>
  {/each}

  <div class="gh-link-row">
    <a href={CI_BASE} class="gh-btn" target="_blank" rel="noopener">
      View Full CI Dashboard on GitHub Pages ↗
    </a>
  </div>
</div>

<style>
  .results-wrap { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-size: 1.8rem; margin-bottom: 8px; }
  .results-sub { color: var(--muted); font-size: 0.875rem; line-height: 1.6; }
  .results-header { margin-bottom: 20px; }

  .ci-notice {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 12px 16px; margin-bottom: 32px;
    font-size: 0.875rem; color: var(--muted); line-height: 1.7;
  }

  .cat-section { margin-bottom: 32px; }
  .cat-label {
    font-size: 0.70rem; text-transform: uppercase; letter-spacing: 0.8px;
    color: var(--faint); margin-bottom: 12px;
    padding-bottom: 6px; border-bottom: 1px solid var(--border2);
  }

  .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .result-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    padding: 18px 20px; text-decoration: none; color: inherit;
    display: flex; flex-direction: column; gap: 10px;
    transition: border-color .15s, background .15s; position: relative;
  }
  .result-card:hover { border-color: var(--blue); background: var(--surface2); text-decoration: none; }
  .rc-icon { font-size: 1.6rem; line-height: 1; }
  .rc-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
  .rc-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
  .rc-arrow { position: absolute; top: 16px; right: 16px; color: var(--faint); font-size: 0.875rem; }

  .gh-link-row { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
  .gh-btn {
    display: inline-flex; align-items: center;
    background: var(--surface); border: 1px solid var(--border); color: var(--muted);
    padding: 10px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 600;
    text-decoration: none; transition: all .15s;
  }
  .gh-btn:hover { border-color: var(--blue); color: var(--blue); text-decoration: none; }

  @media (max-width: 600px) {
    .results-grid { grid-template-columns: 1fr; }
  }
</style>
