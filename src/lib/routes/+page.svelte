<script lang="ts">
  const features = [
    { icon: '🔧', title: 'Compile-Time Functions', desc: 'Define data shapes once with QuickFuncs — eliminate copy-paste across hundreds of entries.' },
    { icon: '🔒', title: 'Built-in Encryption', desc: 'AES-128, AES-256, ChaCha20 — encryption is a first-class section, not an afterthought.' },
    { icon: '🗜️', title: 'Built-in Compression', desc: 'GZip, BZip2, LZMA — compress your config at compile time with zero runtime code.' },
    { icon: '📋', title: 'Strong Types', desc: 'Enums, hex colors, dates, blobs, regexes — all native. Type errors caught at compile time.' },
    { icon: '🌐', title: 'Cross-Platform FFI', desc: 'One Rust core. Bindings for C#, Go, Java, Python, PHP, WASM, and C.' },
    { icon: '⚡', title: 'Zero Runtime Deps', desc: 'Pure Rust. Compile to native binary, WASM, or embed in any app with no external dependencies.' },
  ];

  const comparison = [
    { feature: 'Compile-time functions', json: false, yaml: false, toml: false, jsonnet: true,  dix: true  },
    { feature: 'Built-in encryption',    json: false, yaml: false, toml: false, jsonnet: false, dix: true  },
    { feature: 'Built-in compression',   json: false, yaml: false, toml: false, jsonnet: false, dix: true  },
    { feature: 'Enums',                  json: false, yaml: false, toml: false, jsonnet: '~',   dix: true  },
    { feature: 'Optional commas',        json: false, yaml: true,  toml: false, jsonnet: false, dix: true  },
    { feature: 'Zero runtime deps',      json: true,  yaml: false, toml: true,  jsonnet: false, dix: true  },
    { feature: 'Human-readable',         json: true,  yaml: true,  toml: true,  jsonnet: '~',   dix: true  },
  ];

  function icon(v: boolean | string) {
    if (v === true)  return { sym: '✓', cls: 'yes' };
    if (v === false) return { sym: '✗', cls: 'no'  };
    return { sym: '~', cls: 'partial' };
  }
</script>

<svelte:head><title>DixScript — The Swiss Army Knife of Data Formats</title></svelte:head>

<!-- Hero -->
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">⚠️ Active Development — Not Production Ready</div>
    <h1>Config, Code, and Crypto<br><span class="hero-accent">in One <code>.mdix</code> File</span></h1>
    <p class="hero-sub">DixScript eliminates config sprawl — define data shapes once, compress and encrypt at compile time, ship to any language via FFI.</p>
    <div class="hero-actions">
      <a href="/docs" class="btn btn-primary">Read the Docs</a>
      <a href="/playground" class="btn btn-secondary">Try the Playground</a>
      <a href="https://github.com/Mid-D-Man/DixScript-Rust" class="btn btn-ghost" target="_blank" rel="noopener">GitHub ↗</a>
    </div>
    <div class="hero-langs">
      <span class="lang-chip rust">Rust</span>
      <span class="lang-chip go">Go</span>
      <span class="lang-chip java">Java</span>
      <span class="lang-chip python">Python</span>
      <span class="lang-chip cs">C#</span>
      <span class="lang-chip php">PHP</span>
      <span class="lang-chip wasm">WASM</span>
    </div>
  </div>

  <!-- Code example -->
  <div class="hero-code">
    <div class="code-header">
      <span class="code-dot r"></span><span class="code-dot y"></span><span class="code-dot g"></span>
      <span class="code-fname">weapons.mdix</span>
    </div>
    <pre class="hero-pre"><span class="kw">@ENUMS</span>(
  WeaponClass &#123; PISTOL, RIFLE, SHOTGUN, SNIPER &#125;
  Rarity      &#123; COMMON, RARE, EPIC, LEGENDARY &#125;
)

<span class="kw">@QUICKFUNCS</span>(
  <span class="fn">~weapon</span>&lt;object&gt;(id&lt;string&gt;, name&lt;string&gt;, class&lt;enum&gt;, dmg&lt;int&gt;) &#123;
    return &#123;
      id = id  name = name  class = class
      damage = dmg  sell_value = dmg * 10
    &#125;
  &#125;
)

<span class="kw">@DATA</span>(
  weapons::
    weapon("W001", "Pistol",  WeaponClass.PISTOL,  25),
    weapon("W002", "Rifle",   WeaponClass.RIFLE,   45),
    weapon("W003", "Shotgun", WeaponClass.SHOTGUN, 65)
)</pre>
  </div>
</section>

<!-- Features -->
<section class="section">
  <div class="section-inner">
    <h2 class="section-title">Why DixScript?</h2>
    <p class="section-sub">Born from the frustration of maintaining thousands of lines of repetitive JSON configs in a mobile game.</p>
    <div class="feature-grid">
      {#each features as f}
        <div class="feature-card">
          <div class="feature-icon">{f.icon}</div>
          <div class="feature-title">{f.title}</div>
          <div class="feature-desc">{f.desc}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Comparison -->
<section class="section alt">
  <div class="section-inner">
    <h2 class="section-title">How It Compares</h2>
    <div class="table-wrap">
      <table class="cmp-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>JSON</th><th>YAML</th><th>TOML</th><th>Jsonnet</th>
            <th class="dix-col">DixScript</th>
          </tr>
        </thead>
        <tbody>
          {#each comparison as row}
            <tr>
              <td class="feat-name">{row.feature}</td>
              {#each [row.json, row.yaml, row.toml, row.jsonnet] as v}
                {@const i = icon(v)}
                <td class="cmp-cell {i.cls}">{i.sym}</td>
              {/each}
              <td class="cmp-cell {icon(row.dix).cls} dix-col">{icon(row.dix).sym}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- Status -->
<section class="section">
  <div class="section-inner">
    <h2 class="section-title">Current Status</h2>
    <p class="section-sub">Rust port in active development. The C# prototype is the only currently functional reference implementation.</p>
    <div class="status-grid">
      <div class="status-card done"><div class="sc-label">✅ Complete</div><div class="sc-items">Utilities · ErrorManager · Lexer · AST · Binary Serialization · DLM Pipeline · FFI Layer</div></div>
      <div class="status-card wip"><div class="sc-label">⏳ In Progress</div><div class="sc-items">Parser · Semantic Analyzer · Value Resolution · AST Enhancement</div></div>
      <div class="status-card pending"><div class="sc-label">🔜 Pending</div><div class="sc-items">Runtime API · Language Wrappers (all) · WASM Build · npm Package</div></div>
    </div>
    <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
      <a href="/results" class="btn btn-secondary">View CI Results</a>
      <a href="https://github.com/Mid-D-Man/DixScript" class="btn btn-ghost" target="_blank" rel="noopener">C# Reference Implementation ↗</a>
    </div>
  </div>
</section>

<style>
  .hero {
    max-width: 1280px; margin: 0 auto;
    padding: 64px 24px 48px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 48px; align-items: start;
  }
  .hero-inner { display: flex; flex-direction: column; gap: 20px; }
  .hero-badge {
    display: inline-block; font-size: 0.72rem; font-weight: 600;
    background: rgba(227,179,65,.1); border: 1px solid rgba(227,179,65,.3);
    color: var(--yellow); padding: 4px 12px; border-radius: 20px;
    width: fit-content;
  }
  h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.2; }
  .hero-accent { color: var(--accent); }
  .hero-sub { font-size: 1rem; color: var(--muted); max-width: 480px; line-height: 1.7; }
  .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }

  .btn {
    display: inline-flex; align-items: center;
    padding: 9px 20px; border-radius: 8px; font-size: 0.875rem;
    font-weight: 600; text-decoration: none; transition: all .15s;
    cursor: pointer; border: none; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #e0705a; text-decoration: none; }
  .btn-secondary { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
  .btn-secondary:hover { border-color: var(--blue); color: var(--blue); text-decoration: none; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { color: var(--text); border-color: var(--muted); text-decoration: none; }

  .hero-langs { display: flex; gap: 6px; flex-wrap: wrap; }
  .lang-chip {
    font-size: 0.70rem; font-weight: 700; padding: 3px 9px; border-radius: 4px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .rust   { background:#2a1500; color:#e05d20; border:1px solid #7d3800; }
  .go     { background:#002832; color:#00acd7; border:1px solid #005f80; }
  .java   { background:#2a1800; color:#f89820; border:1px solid #7d4a00; }
  .python { background:#0f2a28; color:#2ea8a0; border:1px solid #1a5c57; }
  .cs     { background:#1a0a2a; color:#9b4dca; border:1px solid #5a1e90; }
  .php    { background:#1a1f3a; color:#8892bf; border:1px solid #3a4080; }
  .wasm   { background:#1a2a0a; color:#7dd67d; border:1px solid #3a6020; }

  .hero-code {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
    position: sticky; top: 72px;
  }
  .code-header {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 16px; background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  .code-dot { width: 12px; height: 12px; border-radius: 50%; }
  .code-dot.r { background: #f85149; } .code-dot.y { background: #e3b341; } .code-dot.g { background: #3fb950; }
  .code-fname { font-family: var(--font-mono); font-size: 0.78rem; color: var(--faint); margin-left: 6px; }
  .hero-pre { border: none; border-radius: 0; margin: 0; background: var(--surface); }
  .kw { color: var(--accent); font-weight: 700; }
  .fn { color: var(--blue); }

  .section { padding: 64px 0; }
  .section.alt { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .section-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
  .section-title { font-size: 1.6rem; margin-bottom: 10px; }
  .section-sub { color: var(--muted); margin-bottom: 32px; font-size: 0.95rem; }

  .feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .feature-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px 22px;
    transition: border-color .15s;
  }
  .feature-card:hover { border-color: var(--accent); }
  .feature-icon { font-size: 1.5rem; margin-bottom: 10px; }
  .feature-title { font-weight: 700; margin-bottom: 6px; }
  .feature-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; }

  .table-wrap { overflow-x: auto; }
  .cmp-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .cmp-table th {
    padding: 10px 16px; text-align: center; color: var(--faint);
    font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border); background: var(--bg);
  }
  .cmp-table th:first-child { text-align: left; }
  .cmp-table td { padding: 10px 16px; border-bottom: 1px solid var(--border2); text-align: center; }
  .feat-name { text-align: left; color: var(--text); font-size: 0.875rem; }
  .cmp-cell.yes     { color: var(--green); font-weight: 700; }
  .cmp-cell.no      { color: var(--faint); }
  .cmp-cell.partial { color: var(--yellow); }
  .dix-col { background: rgba(247,129,102,.04); border-left: 1px solid rgba(247,129,102,.2); color: var(--accent) !important; }

  .status-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .status-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; }
  .status-card.done    { border-color: rgba(63,185,80,.3); }
  .status-card.wip     { border-color: rgba(88,166,255,.3); }
  .status-card.pending { border-color: rgba(72,79,88,.5); }
  .sc-label { font-weight: 700; margin-bottom: 8px; font-size: 0.875rem; }
  .sc-items { font-size: 0.80rem; color: var(--muted); line-height: 1.7; }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .hero-code { position: static; }
  }
</style>
