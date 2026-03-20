<script lang="ts">
  import { docsSections } from '$lib/nav';
  let active = 'intro';

  function scrollTo(id: string) {
    active = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<svelte:head><title>DixScript Docs</title></svelte:head>

<div class="docs-layout">
  <aside class="docs-sidebar">
    <div class="sidebar-label">Documentation</div>
    {#each docsSections as s}
      <button class="sidebar-item" class:active={active === s.id} on:click={() => scrollTo(s.id)}>
        {s.label}
      </button>
    {/each}
  </aside>

  <article class="docs-content">

    <section id="intro">
      <h1>DixScript Documentation</h1>
      <div class="callout warn">⚠️ DixScript is under active development. The Rust port is not production ready. The <a href="https://github.com/Mid-D-Man/DixScript" target="_blank" rel="noopener">C# prototype</a> is the only currently functional reference.</div>
      <p>DixScript (<code>.mdix</code>) is a data interchange format combining configuration, compile-time functions, encryption, and compression in a single file. It was built to solve config sprawl — situations where changing one field requires updating dozens of places across multiple files.</p>
    </section>

    <section id="quickstart">
      <h2>Quick Start</h2>
      <p>A minimal DixScript file needs only a <code>@DATA</code> section:</p>
      <pre>@DATA(
  app_name = "MyApp"
  port&lt;int&gt; = 8080
  debug&lt;bool&gt; = false
)</pre>
      <p>Add a <code>@CONFIG</code> section to enable advanced features:</p>
      <pre>@CONFIG(
  version  -&gt; "1.0.0"
  features -&gt; "advanced"
)

@ENUMS(
  Env &#123; DEV = 1, STAGING = 2, PROD = 3 &#125;
)

@DATA(
  environment&lt;enum&gt; = Env.PROD
  port&lt;int&gt;         = 8443
)</pre>
    </section>

    <section id="config">
      <h2>@CONFIG</h2>
      <p>The configuration section controls compiler behavior. All fields are optional.</p>
      <pre>@CONFIG(
  version            -&gt; "1.0.0"
  encoding           -&gt; "utf-8"
  author             -&gt; "Your Name"
  features           -&gt; "advanced"
  debug_mode         -&gt; "off"       // off | regular | verbose
  error_handling     -&gt; "halt"      // halt | continue | recover
  compatibility_mode -&gt; "strict"    // strict | best_effort | permissive
)</pre>
      <p>Setting <code>features -> "advanced"</code> enables <code>@ENUMS</code>, <code>@QUICKFUNCS</code>, <code>@DLM</code>, and <code>@IMPORTS</code>.</p>
    </section>

    <section id="enums">
      <h2>@ENUMS</h2>
      <p>Define named constants. Values auto-increment from 0 if not specified.</p>
      <pre>@ENUMS(
  LogLevel    &#123; DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 &#125;
  Environment &#123; DEV = 1, STAGING = 2, PROD = 3 &#125;
  Status      &#123; ACTIVE, INACTIVE, PENDING &#125;  // 0, 1, 2
)</pre>
      <p>Reference enum values in <code>@DATA</code> with dot notation: <code>LogLevel.INFO</code></p>
    </section>

    <section id="quickfuncs">
      <h2>@QUICKFUNCS</h2>
      <p>Compile-time functions — executed at compile time, zero runtime overhead. Define the shape of your data once, call it everywhere.</p>
      <pre>@QUICKFUNCS(
  ~makeServer&lt;object&gt;(host&lt;string&gt;, port&lt;int&gt;, ssl&lt;bool&gt;) &#123;
    return &#123;
      host = host
      port = port
      ssl  = ssl
    &#125;
  &#125;

  ~tierLabel&lt;string&gt;(tier&lt;enum&gt;) &#123;
    return tier == Tier.FREE ? "Free" :
           tier == Tier.PRO  ? "Pro"  : "Enterprise"
  &#125;
)</pre>
      <div class="callout info">Functions can call other functions including imported ones. Maximum nesting depth is enforced at compile time to prevent infinite recursion.</div>
    </section>

    <section id="data">
      <h2>@DATA — Two-Tier Ordering</h2>
      <p>The data section enforces a strict two-tier structure. <strong>Flat properties must always come before grouped data.</strong></p>
      <div class="tier-grid">
        <div class="tier-card">
          <div class="tier-label">Tier 1 — Flat Properties</div>
          <pre class="tier-pre">name = "MyApp"
port&lt;int&gt; = 8080
debug&lt;bool&gt; = true</pre>
        </div>
        <div class="tier-card">
          <div class="tier-label">Tier 2A — Table Properties (single colon)</div>
          <pre class="tier-pre">server: host = "localhost", port = 8080</pre>
        </div>
        <div class="tier-card">
          <div class="tier-label">Tier 2B — Group Arrays (double colon)</div>
          <pre class="tier-pre">tags:: "web", "api", "v1"

items::
  makeItem("I001", "Sword"),
  makeItem("I002", "Shield")</pre>
        </div>
      </div>
      <div class="callout warn">Never use dot notation for path assignment. <code>server.host = "x"</code> is invalid. Use table properties: <code>server: host = "x"</code></div>
    </section>

    <section id="dlm">
      <h2>@DLM — Data Lifecycle Modules</h2>
      <p>Attach compression, encryption, and auditing to your compiled output.</p>
      <pre>@DLM(
  DCompressor.gzip    // gzip | bzip2 | lzma
  DEncryptor.aes256   // aes128 | aes256 | chacha20 | xor
  DAuditor.enhanced   // diy | enhanced
)</pre>
      <p>Modules execute in order: compress → encrypt → audit. Output files:</p>
      <div class="file-list">
        <div class="file-row"><code>.mdix.enc</code><span>Compressed and/or encrypted binary</span></div>
        <div class="file-row"><code>.mdix.key</code><span>Key file for decryption (keyfile mode)</span></div>
        <div class="file-row"><code>.mdix.au</code><span>Audit trail (DAuditor only)</span></div>
      </div>
    </section>

    <section id="security">
      <h2>@SECURITY</h2>
      <p>Required when using <code>DEncryptor</code>. Specifies encryption mode.</p>
      <pre>// Password mode — key derived at runtime from a password
@SECURITY(
  encryption -&gt; &#123; mode = "password", algorithm = "aes256-gcm" &#125;
)

// Keyfile mode — key stored in .mdix.key file
@SECURITY(
  encryption -&gt; &#123; mode = "keyfile", algorithm = "aes256-gcm" &#125;
)</pre>
    </section>

    <section id="imports">
      <h2>@IMPORTS</h2>
      <p>Import enums and functions from other <code>.mdix</code> files. Access imported symbols via the alias namespace.</p>
      <pre>@IMPORTS(
  Base    from "base_types.mdix"
  Helpers from "game_helpers.mdix"
)

@DATA(
  item&lt;object&gt;  = Base.makeItem("W001", "Sword", Base.ItemType.WEAPON, Base.Rarity.RARE, 50)
  enemy&lt;object&gt; = Helpers.makeEnemy("E001", "Goblin", 100, Helpers.Difficulty.NORMAL)
)</pre>
      <div class="callout info">Cyclic imports are detected and rejected at compile time.</div>
    </section>

    <section id="types">
      <h2>Data Types</h2>
      <div class="types-grid">
        {#each [
          ['int',       '42, -17, 0',                      'Signed 32-bit integer'],
          ['float',     '3.14f, -2.5f, 42f',               'Single precision float (f suffix)'],
          ['double',    '3.14159, 2.718e10',               'Double precision float'],
          ['string',    '"hello", \'world\'',               'Double or single quoted'],
          ['bool',      'true, false',                      'Boolean'],
          ['hex',       '0xFF, 0xDEADBEEF',                'Hex integer literal'],
          ['hex color', '#FF5733, #F00, #FF5733FF',         'RGB or RGBA hex color'],
          ['date',      '2025-01-15',                       'ISO 8601 date'],
          ['timestamp', '2025-01-15T10:30:00Z',             'ISO 8601 timestamp'],
          ['blob',      'b:("SGVsbG8=")',                   'Base64 encoded binary'],
          ['regex',     'r:("^[a-z]+$")',                   'Regular expression'],
          ['tuple',     't:(1, "text", true)',               'Mixed-type tuple up to 4 elements'],
          ['array',     '[1, 2, 3], ["a", "b"]',            'Homogeneous array'],
          ['object',    '{ id = 1, name = "x" }',          'Inline object literal'],
          ['enum',      'Status.ACTIVE',                    'Enum value reference'],
          ['null',      'null',                             'Null value'],
        ] as [type, example, desc]}
          <div class="type-row">
            <code class="type-name">{type}</code>
            <code class="type-example">{example}</code>
            <span class="type-desc">{desc}</span>
          </div>
        {/each}
      </div>
    </section>

    <section id="cli">
      <h2>CLI Reference</h2>
      <div class="callout warn">CLI is partially implemented. Commands below reflect the intended API.</div>
      <pre>mdix compile &lt;file&gt;              # Compile .mdix to binary
mdix compile &lt;file&gt; --password   # Compile with password encryption
mdix validate &lt;file&gt;             # Validate syntax and semantics
mdix inspect  &lt;file&gt;             # Print parsed data as JSON
mdix inspect  &lt;file&gt; --format json
mdix decrypt  &lt;file.enc&gt; --password &lt;pw&gt;
mdix convert  &lt;file&gt; --to json
mdix convert  &lt;file&gt; --to toml
mdix format   &lt;file&gt;
mdix compact  &lt;file&gt;
mdix minify   &lt;file&gt;</pre>
    </section>

    <section id="ffi">
      <h2>Language Bindings</h2>
      <p>All wrappers bind to the Rust runtime via FFI. They compile but are not usable until the runtime reaches feature parity.</p>
      <div class="bindings-grid">
        {#each [
          { lang: 'C# / Unity', pkg: 'MidManStudio.Mdix NuGet',       status: 'pending', badge: 'cs'     },
          { lang: 'Go',         pkg: 'mdix-go (cgo)',                  status: 'pending', badge: 'go'     },
          { lang: 'Java',       pkg: 'mdix-java (JNI)',                status: 'pending', badge: 'java'   },
          { lang: 'Python',     pkg: 'midmanstudio-mdix (PyO3)',       status: 'pending', badge: 'python' },
          { lang: 'PHP',        pkg: 'midmanstudio/mdix (PHP FFI)',    status: 'pending', badge: 'php'    },
          { lang: 'WASM',       pkg: 'mdix-wasm (npm)',                status: 'pending', badge: 'wasm'   },
        ] as b}
          <div class="binding-card">
            <span class="lang-chip {b.badge}">{b.lang}</span>
            <code style="font-size:.78rem">{b.pkg}</code>
            <span style="font-size:.72rem;color:var(--faint)">⏳ Pending runtime</span>
          </div>
        {/each}
      </div>
    </section>

  </article>
</div>

<style>
  .docs-layout {
    display: grid; grid-template-columns: 220px 1fr;
    max-width: 1280px; margin: 0 auto;
    min-height: calc(100vh - 56px);
  }

  .docs-sidebar {
    position: sticky; top: 56px; height: calc(100vh - 56px);
    overflow-y: auto; border-right: 1px solid var(--border);
    padding: 24px 12px;
  }
  .sidebar-label {
    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.8px;
    color: var(--faint); padding: 0 8px; margin-bottom: 8px;
  }
  .sidebar-item {
    display: block; width: 100%; text-align: left;
    background: none; border: none; color: var(--muted);
    padding: 7px 10px; border-radius: 6px; font-size: 0.85rem;
    cursor: pointer; transition: all .15s;
  }
  .sidebar-item:hover { color: var(--text); background: var(--surface2); }
  .sidebar-item.active { color: var(--accent); background: rgba(247,129,102,.08); font-weight: 600; }

  .docs-content {
    padding: 40px 48px;
    max-width: 860px;
  }

  .docs-content section {
    margin-bottom: 56px;
    scroll-margin-top: 72px;
  }

  .docs-content h1 { font-size: 2rem; margin-bottom: 16px; }
  .docs-content h2 {
    font-size: 1.35rem; margin-bottom: 14px;
    padding-bottom: 8px; border-bottom: 1px solid var(--border);
    color: var(--accent);
  }
  .docs-content p { color: var(--muted); margin-bottom: 14px; line-height: 1.7; }
  .docs-content pre { margin: 16px 0; }

  .callout {
    border-radius: 8px; padding: 12px 16px; margin: 16px 0;
    font-size: 0.875rem; line-height: 1.6;
  }
  .callout.warn { background: rgba(227,179,65,.08); border: 1px solid rgba(227,179,65,.25); color: var(--yellow); }
  .callout.info { background: rgba(88,166,255,.08); border: 1px solid rgba(88,166,255,.25); color: var(--blue); }

  .tier-grid { display: flex; flex-direction: column; gap: 12px; margin: 16px 0; }
  .tier-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .tier-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); padding: 8px 14px; background: var(--surface2); border-bottom: 1px solid var(--border); }
  .tier-pre { margin: 0; border: none; border-radius: 0; background: var(--surface); }

  .file-list { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-top: 12px; }
  .file-row { display: flex; align-items: center; gap: 14px; padding: 10px 16px; border-bottom: 1px solid var(--border2); font-size: 0.875rem; }
  .file-row:last-child { border-bottom: none; }
  .file-row span { color: var(--muted); }

  .types-grid { display: flex; flex-direction: column; gap: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .type-row { display: grid; grid-template-columns: 100px 220px 1fr; gap: 12px; padding: 9px 16px; border-bottom: 1px solid var(--border2); align-items: center; font-size: 0.82rem; }
  .type-row:last-child { border-bottom: none; }
  .type-name { color: var(--accent); }
  .type-example { color: var(--blue); background: none; border: none; padding: 0; }
  .type-desc { color: var(--muted); }

  .bindings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 16px; }
  .binding-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }

  @media (max-width: 768px) {
    .docs-layout { grid-template-columns: 1fr; }
    .docs-sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 4px; padding: 12px; }
    .sidebar-label { display: none; }
    .sidebar-item { width: auto; padding: 5px 10px; font-size: 0.78rem; }
    .docs-content { padding: 24px 16px; }
    .type-row { grid-template-columns: 80px 1fr; }
    .type-example { display: none; }
  }
</style>
