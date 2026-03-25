<script lang="ts">
  import { onMount } from 'svelte';

  // ── Sidebar sections ──────────────────────────────────────────
  const sections = [
    { id: 'intro',       label: 'Introduction'         },
    { id: 'quickstart',  label: 'Quick Start'          },
    { id: 'config',      label: '@CONFIG'              },
    { id: 'enums',       label: '@ENUMS'               },
    { id: 'quickfuncs',  label: '@QUICKFUNCS'          },
    { id: 'data',        label: '@DATA'                },
    { id: 'dlm',         label: '@DLM'                 },
    { id: 'security',    label: '@SECURITY'            },
    { id: 'imports',     label: '@IMPORTS'             },
    { id: 'variables',   label: 'Variables'            },
    { id: 'types',       label: 'Data Types'           },
    { id: 'cli',         label: 'CLI Reference'        },
    { id: 'ffi',         label: 'Language Bindings'    },
  ];

  let activeId = 'intro';
  let contentEl: HTMLElement | null = null;

  function scrollToSection(id: string): void {
    activeId = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    if (!contentEl) return;

    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            activeId = e.target.id;
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  });

  // ── Type table data ───────────────────────────────────────────
  const types = [
    { type: 'int',       example: '42, -17, 0',               desc: 'Signed 32-bit integer'          },
    { type: 'float',     example: '3.14f, -2.5f, 42f',        desc: 'Single precision (f suffix)'    },
    { type: 'double',    example: '3.14159, 2.718e10',         desc: 'Double precision float'         },
    { type: 'string',    example: '"hello", \'world\'',        desc: 'Double or single quoted'        },
    { type: 'bool',      example: 'true, false',               desc: 'Boolean'                        },
    { type: 'hex',       example: '0xFF, 0xDEADBEEF',          desc: 'Hex integer literal'            },
    { type: 'hex color', example: '#FF5733, #F00',             desc: 'RGB or RGBA hex color'          },
    { type: 'date',      example: '2025-01-15',                desc: 'ISO 8601 date'                  },
    { type: 'timestamp', example: '2025-01-15T10:30:00Z',      desc: 'ISO 8601 timestamp'             },
    { type: 'blob',      example: 'b:("SGVsbG8=")',            desc: 'Base64 encoded binary'          },
    { type: 'regex',     example: 'r:("^[a-z]+$")',            desc: 'Regular expression'             },
    { type: 'tuple',     example: 't:(1, "text", true)',        desc: 'Mixed-type up to 4 elements'   },
    { type: 'array',     example: '[1, 2, 3], ["a", "b"]',     desc: 'Homogeneous array'              },
    { type: 'object',    example: '{ id = 1, name = "x" }',    desc: 'Inline object literal'          },
    { type: 'enum',      example: 'Status.ACTIVE',             desc: 'Enum value reference'           },
    { type: 'null',      example: 'null',                      desc: 'Null value'                     },
  ];

  // ── Feature comparison table ───────────────────────────────────
  const cmpRows = [
    { feature: 'Compile-time functions', json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Built-in encryption',    json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Built-in compression',   json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Enums / constants',      json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Comments',               json: false, yaml: true,  toml: true,  dix: true  },
    { feature: 'Optional trailing comma',json: false, yaml: true,  toml: false, dix: true  },
    { feature: 'Zero runtime deps',      json: true,  yaml: false, toml: true,  dix: true  },
    { feature: 'Import system',          json: false, yaml: false, toml: false, dix: true  },
  ];

  function cellClass(v: boolean): string {
    return v ? 'td-yes' : 'td-no';
  }

  function cellText(v: boolean): string {
    return v ? '✓' : '✗';
  }
</script>

<svelte:head>
  <title>DixScript Documentation</title>
  <meta name="description" content="Complete DixScript documentation — syntax, sections, types, CLI reference and language bindings." />
</svelte:head>

<div class="docs-shell">

  <!-- ── Sidebar ──────────────────────────────────────────────── -->
  <aside class="docs-sidebar">
    <div class="sidebar-label">Documentation</div>
    <nav aria-label="Documentation sections">
      {#each sections as s}
        <button
          class="sidebar-item"
          class:active={activeId === s.id}
          on:click={() => scrollToSection(s.id)}
          aria-current={activeId === s.id ? 'location' : undefined}
        >
          {s.label}
        </button>
      {/each}
    </nav>
  </aside>

  <!-- ── Main content ─────────────────────────────────────────── -->
  <article class="docs-content" bind:this={contentEl}>

    <!-- ── Introduction ── -->
    <section id="intro" class="doc-section">
      <h1>DixScript Documentation</h1>

      <div class="callout callout--warn">
        ⚠️ DixScript is under active development and not production-ready.
        The <a href="https://github.com/Mid-D-Man/DixScript" target="_blank" rel="noopener noreferrer">C# prototype</a>
        is the current reference implementation. The Rust port is in progress.
      </div>

      <p>
        DixScript (<code>.mdix</code>) is a programmable configuration format where you define patterns
        once and reuse them everywhere. It combines configuration, compile-time functions, encryption,
        and compression in a single file — with zero external dependencies.
      </p>

      <p>
        A minimal DixScript file requires only a <code>@DATA</code> section. Everything else is optional
        and additive — you adopt features as you need them.
      </p>

      <h2>File sections (all optional except @DATA)</h2>
      <div class="section-list">
        {#each [
          { name: '@CONFIG',     desc: 'Compiler settings and file metadata'                                   },
          { name: '@IMPORTS',    desc: 'Import functions and enums from other .mdix files'                     },
          { name: '@ENUMS',      desc: 'Named constant sets — enforced at compile time'                        },
          { name: '@QUICKFUNCS', desc: 'Compile-time functions — zero runtime overhead'                        },
          { name: '@DATA',       desc: 'Your configuration data — the only required section'                   },
          { name: '@SECURITY',   desc: 'Encryption mode and key configuration'                                 },
          { name: '@DLM',        desc: 'Data Lifecycle Modules: compression, encryption, auditing'             },
        ] as item}
          <div class="section-row">
            <code class="section-name">{item.name}</code>
            <span class="section-desc">{item.desc}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- ── Quick Start ── -->
    <section id="quickstart" class="doc-section">
      <h2>Quick Start</h2>
      <p>The smallest valid DixScript file:</p>
      <pre><code>@DATA(
  app_name = "MyApp"
  port&lt;int&gt; = 8080
  debug&lt;bool&gt; = false
)</code></pre>

      <p>Add sections as you need them:</p>
      <pre><code>@CONFIG(
  version  -&gt; "1.0.0"
  features -&gt; "advanced"
)

@ENUMS(
  Env &#123; DEV, STAGING, PROD &#125;
)

@QUICKFUNCS(
  ~service&lt;object&gt;(name, url, timeout&lt;int&gt;) &#123;
    return &#123; name = name, url = url, timeout = timeout &#125;
  &#125;
)

@DATA(
  environment&lt;enum&gt; = Env.PROD

  services::
    service("api",      "https://api.example.com", 30000),
    service("frontend", "https://example.com",     15000)
)</code></pre>

      <div class="callout callout--info">
        Setting <code>features -&gt; "advanced"</code> in @CONFIG unlocks @ENUMS, @QUICKFUNCS, @DLM, and @IMPORTS.
      </div>
    </section>

    <!-- ── @CONFIG ── -->
    <section id="config" class="doc-section">
      <h2>@CONFIG</h2>
      <p>Controls compiler behaviour. All keys are optional.</p>
      <pre><code>@CONFIG(
  version            -&gt; "1.0.0"
  encoding           -&gt; "utf-8"
  author             -&gt; "Your Name"
  features           -&gt; "advanced"
  debug_mode         -&gt; "off"       // off | regular | verbose
  error_handling     -&gt; "halt"      // halt | continue | recover
  compatibility_mode -&gt; "strict"    // strict | best_effort | permissive
)</code></pre>

      <div class="kv-table">
        {#each [
          { key: 'version',            type: 'string', desc: 'File version string e.g. "1.0.0"'                },
          { key: 'encoding',           type: 'string', desc: '"utf-8" (default), "utf-16", "ascii"'            },
          { key: 'author',             type: 'string', desc: 'Author name'                                     },
          { key: 'features',           type: 'string', desc: '"basic" (default) or "advanced"'                 },
          { key: 'debug_mode',         type: 'enum',   desc: '"off" | "regular" | "verbose"'                   },
          { key: 'error_handling',     type: 'enum',   desc: '"halt" | "continue" | "recover"'                 },
          { key: 'compatibility_mode', type: 'enum',   desc: '"strict" | "best_effort" | "permissive"'         },
        ] as row}
          <div class="kv-row">
            <code class="kv-key">{row.key}</code>
            <span class="kv-type">{row.type}</span>
            <span class="kv-desc">{row.desc}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- ── @ENUMS ── -->
    <section id="enums" class="doc-section">
      <h2>@ENUMS</h2>
      <p>
        Define named constant sets. Values auto-increment from 0 if not assigned.
        Enum types are enforced at compile time — invalid values are errors, not runtime surprises.
      </p>
      <pre><code>@ENUMS(
  LogLevel    &#123; DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 &#125;
  Environment &#123; DEV = 1, STAGING = 2, PROD = 3 &#125;
  Status      &#123; ACTIVE, INACTIVE, PENDING &#125;  // auto: 0, 1, 2
)

@DATA(
  current_env&lt;enum&gt; = Environment.PROD
  log_level&lt;enum&gt;   = LogLevel.INFO
)</code></pre>

      <div class="callout callout--info">
        Enums are referenced with dot notation: <code>EnumName.VALUE</code>.
        Using an undefined value like <code>Status.DELETED</code> is a compile error.
      </div>
    </section>

    <!-- ── @QUICKFUNCS ── -->
    <section id="quickfuncs" class="doc-section">
      <h2>@QUICKFUNCS</h2>
      <p>
        Compile-time functions — they execute at parse time and produce zero runtime overhead.
        Define your data shape once, call it everywhere.
      </p>
      <pre><code>@QUICKFUNCS(
  // Basic function — returns an object
  ~makeServer&lt;object&gt;(host&lt;string&gt;, port&lt;int&gt;, ssl&lt;bool&gt;) &#123;
    return &#123;
      host = host
      port = port
      ssl  = ssl
    &#125;
  &#125;

  // Functions can call other functions
  ~dbUrl&lt;string&gt;(host, port&lt;int&gt;) &#123;
    return $"postgres://{host}:{port}/app"
  &#125;

  // Conditional expressions
  ~envLabel&lt;string&gt;(env&lt;enum&gt;) &#123;
    return env == Env.PROD ? "production" : "development"
  &#125;
)</code></pre>

      <h3>Scope declaration</h3>
      <p>
        Functions declared with <code>=&gt; global</code> are exported and importable by other files.
        The default scope is internal to the file.
      </p>
      <pre><code>// Exported — callable from other files via import alias
~sharedHelper =&gt; global(x&lt;int&gt;) &#123; return x * 2 &#125;

// Internal only
~localHelper(x&lt;int&gt;) &#123; return x + 1 &#125;</code></pre>

      <div class="callout callout--warn">
        Maximum nesting depth is enforced at compile time to prevent infinite recursion.
      </div>
    </section>

    <!-- ── @DATA ── -->
    <section id="data" class="doc-section">
      <h2>@DATA — Two-Tier Ordering</h2>
      <p>
        The @DATA section enforces a strict two-tier structure.
        <strong>Flat properties must always come before grouped data.</strong>
      </p>

      <div class="tier-grid">
        <div class="tier-card">
          <div class="tier-label">Tier 1 — Flat properties</div>
          <pre class="tier-pre"><code>name = "MyApp"
port&lt;int&gt; = 8080
debug&lt;bool&gt; = true</code></pre>
        </div>
        <div class="tier-card">
          <div class="tier-label">Tier 2A — Table (single colon)</div>
          <pre class="tier-pre"><code>server: host = "localhost", port = 8080</code></pre>
        </div>
        <div class="tier-card">
          <div class="tier-label">Tier 2B — Array group (double colon)</div>
          <pre class="tier-pre"><code>tags:: "web", "api", "v1"

items::
  makeItem("I001", "Sword"),
  makeItem("I002", "Shield")</code></pre>
        </div>
      </div>

      <div class="callout callout--warn">
        Do <strong>not</strong> use dot notation for path assignment.
        <code>server.host = "x"</code> is invalid syntax.
        Use table syntax: <code>server: host = "x"</code>
      </div>

      <h3>Full example</h3>
      <pre><code>@DATA(
  // Tier 1 — flat properties first
  app_name = "MyApp"
  version  = "1.0.0"
  port&lt;int&gt; = 8080

  // Tier 2A — table properties
  database:
    host = "db.prod.internal"
    port = 5432
    ssl  = true

  // Tier 2B — array groups
  tags:: "web", "api"

  services::
    makeService("auth",    8081),
    makeService("payment", 8082)
)</code></pre>
    </section>

    <!-- ── @DLM ── -->
    <section id="dlm" class="doc-section">
      <h2>@DLM — Data Lifecycle Modules</h2>
      <p>
        Attach compression, encryption, and auditing to your compiled output.
        Modules execute in order: compress → encrypt → audit.
      </p>
      <pre><code>@DLM(
  DCompressor.gzip    // gzip | bzip2 | lzma
  DEncryptor.aes256   // aes128 | aes256 | chacha20 | xor
  DAuditor.enhanced   // diy | enhanced
)</code></pre>

      <div class="kv-table">
        {#each [
          { key: 'DCompressor.gzip',    desc: 'Standard gzip — fast, widely supported'            },
          { key: 'DCompressor.bzip2',   desc: 'Better compression ratio than gzip'                },
          { key: 'DCompressor.lzma',    desc: 'Best compression — slower, ideal for large configs'},
          { key: 'DEncryptor.xor',      desc: 'XOR obfuscation — fast, not cryptographically secure'},
          { key: 'DEncryptor.aes128',   desc: 'AES-128 encryption'                                },
          { key: 'DEncryptor.aes256',   desc: 'AES-256 — recommended for sensitive data'          },
          { key: 'DEncryptor.chacha20', desc: 'ChaCha20 stream cipher — fast and modern'          },
          { key: 'DAuditor.enhanced',   desc: 'Track access, changes, timestamps'                 },
          { key: 'DAuditor.diy',        desc: 'Custom audit implementation'                       },
        ] as row}
          <div class="kv-row">
            <code class="kv-key">{row.key}</code>
            <span class="kv-desc" style="grid-column: 2 / 4">{row.desc}</span>
          </div>
        {/each}
      </div>

      <h3>Output files</h3>
      <div class="kv-table">
        {#each [
          { key: '.mdix.enc', desc: 'Compressed and/or encrypted binary output'   },
          { key: '.mdix.key', desc: 'Key file for decryption (keyfile mode only)' },
          { key: '.mdix.au',  desc: 'Audit trail log (DAuditor only)'             },
        ] as row}
          <div class="kv-row">
            <code class="kv-key">{row.key}</code>
            <span class="kv-desc" style="grid-column: 2 / 4">{row.desc}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- ── @SECURITY ── -->
    <section id="security" class="doc-section">
      <h2>@SECURITY</h2>
      <p>Required when using DEncryptor. Specifies key derivation mode and algorithm.</p>
      <pre><code>// Password mode — key derived at runtime from user input
@SECURITY(
  encryption -&gt; &#123; mode = "password", algorithm = "aes256-gcm" &#125;
)

// Keyfile mode — key stored in .mdix.key alongside the binary
@SECURITY(
  encryption -&gt; &#123; mode = "keyfile", algorithm = "aes256-gcm" &#125;
)</code></pre>
    </section>

    <!-- ── @IMPORTS ── -->
    <section id="imports" class="doc-section">
      <h2>@IMPORTS</h2>
      <p>
        Import enums and functions from other .mdix files — local or via cloud URL.
        Access imported symbols through the alias namespace.
      </p>
      <pre><code>@IMPORTS(
  // Local file import
  Base    from "lib/base_types.mdix"

  // Cloud import
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game_helpers.mdix"

  // With SHA-256 hash verification
  Secure  from "crypto/lib.mdix" verify "sha256:abc123..."
)

@DATA(
  item&lt;object&gt;  = Base.makeItem("W001", "Sword", Base.ItemType.WEAPON, 50)
  enemy&lt;object&gt; = Helpers.makeEnemy("E001", "Goblin", 100)
)</code></pre>

      <div class="callout callout--info">
        Only functions declared <code>=&gt; global</code> are exported and importable.
        Circular imports are detected and rejected at compile time.
      </div>

      <h3>Path rules</h3>
      <ul class="rule-list">
        <li>Use forward slashes — no backslashes, even on Windows</li>
        <li>File extension <code>.mdix</code> is required</li>
        <li>No spaces in paths — use underscores or hyphens</li>
        <li>Paths are case-sensitive on Unix systems</li>
      </ul>
    </section>

    <!-- ── Variables ── -->
    <section id="variables" class="doc-section">
      <h2>Variables</h2>
      <p>
        DixScript uses Rust-style variable semantics — immutable by default,
        explicit mutation with <code>let mut</code>.
      </p>
      <pre><code>// Immutable — cannot be reassigned
let name = "Alice"
let count&lt;int&gt; = 42

// Compile-time constant — must be a literal
const MAX_RETRIES = 3
const API_VERSION = "v2"

// Mutable — can be reassigned
let mut total = 0
total += item.price   // OK
total = recalculate() // OK</code></pre>

      <div class="kv-table">
        {#each [
          { key: 'let',     desc: 'Immutable binding — default choice for most values' },
          { key: 'const',   desc: 'Compile-time literal — inlined by the compiler'     },
          { key: 'let mut', desc: 'Mutable binding — explicit, intentional mutation'   },
        ] as row}
          <div class="kv-row">
            <code class="kv-key">{row.key}</code>
            <span class="kv-desc" style="grid-column: 2 / 4">{row.desc}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- ── Data Types ── -->
    <section id="types" class="doc-section">
      <h2>Data Types</h2>
      <p>
        Types are inferred from the assigned value. Add explicit annotations
        (<code>&lt;int&gt;</code>, <code>&lt;float&gt;</code>, <code>&lt;enum&gt;</code> etc.)
        where you want strictness.
      </p>
      <div class="table-scroll">
        <table class="types-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Example</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {#each types as t}
              <tr>
                <td><code>{t.type}</code></td>
                <td class="td-example"><code>{t.example}</code></td>
                <td>{t.desc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <h3>Format comparison</h3>
      <div class="table-scroll">
        <table class="cmp-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>JSON</th>
              <th>YAML</th>
              <th>TOML</th>
              <th class="th-dix">DixScript</th>
            </tr>
          </thead>
          <tbody>
            {#each cmpRows as row}
              <tr>
                <td class="td-feature">{row.feature}</td>
                <td class={cellClass(row.json)}>{cellText(row.json)}</td>
                <td class={cellClass(row.yaml)}>{cellText(row.yaml)}</td>
                <td class={cellClass(row.toml)}>{cellText(row.toml)}</td>
                <td class="td-dix {cellClass(row.dix)}">{cellText(row.dix)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── CLI ── -->
    <section id="cli" class="doc-section">
      <h2>CLI Reference</h2>

      <div class="callout callout--warn">
        CLI is partially implemented. Commands below reflect the intended API —
        not all are functional in the current Rust port.
      </div>

      <pre><code>mdix compile &lt;file&gt;              # Compile .mdix to binary
mdix compile &lt;file&gt; --password   # Compile with password encryption
mdix validate &lt;file&gt;             # Validate syntax and semantics
mdix inspect  &lt;file&gt;             # Print parsed data as JSON
mdix inspect  &lt;file&gt; --format json
mdix decrypt  &lt;file.enc&gt; --password &lt;pw&gt;
mdix convert  &lt;file&gt; --to json
mdix convert  &lt;file&gt; --to toml
mdix format   &lt;file&gt;
mdix compact  &lt;file&gt;
mdix minify   &lt;file&gt;</code></pre>
    </section>

    <!-- ── Language Bindings ── -->
    <section id="ffi" class="doc-section">
      <h2>Language Bindings</h2>
      <p>
        All wrappers bind to the Rust core via FFI. They compile but are not usable
        until the runtime reaches feature parity with the C# prototype.
      </p>

      <div class="bindings-grid">
        {#each [
          { lang: 'C# / Unity',    pkg: 'MidManStudio.Mdix (NuGet)',  status: 'Pending runtime',  cls: 'cs'     },
          { lang: 'Go',            pkg: 'mdix-go (cgo)',              status: 'Pending runtime',  cls: 'go'     },
          { lang: 'Java',          pkg: 'mdix-java (JNI)',            status: 'Pending runtime',  cls: 'java'   },
          { lang: 'Python',        pkg: 'midmanstudio-mdix (PyO3)',   status: 'Pending runtime',  cls: 'python' },
          { lang: 'PHP',           pkg: 'midmanstudio/mdix (FFI)',    status: 'Pending runtime',  cls: 'php'    },
          { lang: 'WebAssembly',   pkg: 'mdix-wasm (npm)',            status: 'Pending runtime',  cls: 'wasm'   },
        ] as b}
          <div class="binding-card">
            <div class="binding-lang binding-lang--{b.cls}">{b.lang}</div>
            <code class="binding-pkg">{b.pkg}</code>
            <span class="binding-status">⏳ {b.status}</span>
          </div>
        {/each}
      </div>

      <div class="callout callout--info" style="margin-top:1.5rem">
        Track progress and CI results on the
        <a href="/results">CI Results</a> page or in the
        <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer">Rust repo ↗</a>.
      </div>
    </section>

  </article>
</div>

<style>
  /* ── Layout ── */
  .docs-shell {
    display: grid;
    grid-template-columns: 220px 1fr;
    max-width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 4rem);
    align-items: start;
  }

  /* ── Sidebar ── */
  .docs-sidebar {
    position: sticky;
    top: 4rem;
    height: calc(100vh - 4rem);
    overflow-y: auto;
    border-right: 1px solid var(--border);
    padding: 1.5rem 0.75rem;
    background: var(--background);
    transition: background 0.3s ease;
  }

  .sidebar-label {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-foreground);
    padding: 0 0.625rem;
    margin-bottom: 0.625rem;
  }

  .sidebar-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: var(--muted-foreground);
    padding: 0.4375rem 0.625rem;
    border-radius: var(--radius);
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 400;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
    line-height: 1.4;
  }

  .sidebar-item:hover {
    color: var(--foreground);
    background: var(--secondary);
  }

  .sidebar-item.active {
    color: var(--primary);
    background: var(--muted);
    font-weight: 600;
  }

  /* ── Content ── */
  .docs-content {
    padding: 2.5rem 3rem;
    min-width: 0;
    max-width: 800px;
  }

  .doc-section {
    margin-bottom: 4rem;
    scroll-margin-top: 5rem;
  }

  /* ── Typography ── */
  .docs-content h1 {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
  }

  .docs-content h2 {
    font-size: 1.375rem;
    margin-bottom: 1rem;
    margin-top: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
    color: var(--primary);
  }

  .doc-section > h2:first-child {
    margin-top: 0;
  }

  .docs-content h3 {
    font-size: 1.0625rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--foreground);
  }

  .docs-content p {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  .docs-content pre {
    margin: 1rem 0 1.5rem;
    font-size: 0.8125rem;
  }

  .docs-content a {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.15s ease;
  }

  .docs-content a:hover { opacity: 0.75; }

  /* ── Callouts ── */
  .callout {
    border-radius: 6px;
    padding: 0.875rem 1.125rem;
    margin: 1rem 0 1.5rem;
    font-size: 0.875rem;
    line-height: 1.7;
    border-left: 3px solid transparent;
  }

  .callout--warn {
    background: rgba(181, 74, 53, 0.07);
    border-color: var(--destructive);
    color: var(--foreground);
  }

  .callout--info {
    background: rgba(166, 124, 82, 0.07);
    border-color: var(--primary);
    color: var(--foreground);
  }

  /* ── Section list ── */
  .section-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .section-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 1rem;
    align-items: baseline;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.875rem;
  }

  .section-row:last-child { border-bottom: none; }

  .section-name {
    color: var(--primary);
    font-size: 0.875rem;
  }

  .section-desc {
    color: var(--muted-foreground);
  }

  /* ── KV table ── */
  .kv-table {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin: 1rem 0 1.5rem;
  }

  .kv-row {
    display: grid;
    grid-template-columns: 200px 80px 1fr;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--border);
    align-items: baseline;
    font-size: 0.8125rem;
  }

  .kv-row:last-child { border-bottom: none; }

  .kv-key {
    color: var(--primary);
    font-size: 0.8125rem;
  }

  .kv-type {
    color: var(--muted-foreground);
    font-size: 0.75rem;
    font-family: var(--font-mono);
  }

  .kv-desc {
    color: var(--muted-foreground);
  }

  /* ── Tier cards ── */
  .tier-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0 1.5rem;
  }

  .tier-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .tier-label {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary);
    padding: 0.5rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
  }

  .tier-pre {
    margin: 0;
    border: none;
    border-radius: 0;
    background: var(--card);
    font-size: 0.8125rem;
  }

  /* ── Rule list ── */
  .rule-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rule-list li {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    padding-left: 1.25rem;
    position: relative;
    line-height: 1.6;
  }

  .rule-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 600;
  }

  /* ── Tables ── */
  .table-scroll {
    overflow-x: auto;
    margin: 1rem 0 1.5rem;
  }

  .types-table,
  .cmp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .types-table th,
  .cmp-table th {
    text-align: left;
    padding: 0.625rem 0.875rem;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted-foreground);
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
  }

  .types-table td,
  .cmp-table td {
    padding: 0.5625rem 0.875rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.8125rem;
    color: var(--foreground);
    vertical-align: middle;
  }

  .types-table tr:last-child td,
  .cmp-table tr:last-child td {
    border-bottom: none;
  }

  .types-table tr:hover td,
  .cmp-table tr:hover td {
    background: var(--secondary);
  }

  .td-example { color: var(--primary); }
  .td-feature { color: var(--foreground); font-weight: 500; }

  .th-dix { color: var(--primary); }
  .td-dix { background: rgba(166,124,82,0.04); border-left: 1px solid rgba(166,124,82,0.2); }

  .td-yes { color: #3d9e50; font-weight: 600; text-align: center; }
  .td-no  { color: var(--muted-foreground); text-align: center; opacity: 0.6; }

  /* ── Bindings grid ── */
  .bindings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.875rem;
    margin-top: 1rem;
  }

  .binding-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.125rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.15s ease;
  }

  .binding-card:hover { border-color: var(--primary); }

  .binding-lang {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 0.1875rem 0.625rem;
    border-radius: 4px;
    width: fit-content;
  }

  .binding-lang--cs     { background: rgba(155, 77, 202, 0.12); color: #9b4dca; border: 1px solid rgba(155, 77, 202, 0.3); }
  .binding-lang--go     { background: rgba(0, 172, 215, 0.12);  color: #00acd7; border: 1px solid rgba(0, 172, 215, 0.3);  }
  .binding-lang--java   { background: rgba(248, 152, 32, 0.12); color: #f89820; border: 1px solid rgba(248, 152, 32, 0.3); }
  .binding-lang--python { background: rgba(46, 168, 160, 0.12); color: #2ea8a0; border: 1px solid rgba(46, 168, 160, 0.3); }
  .binding-lang--php    { background: rgba(136, 146, 191, 0.12);color: #8892bf; border: 1px solid rgba(136, 146, 191, 0.3);}
  .binding-lang--wasm   { background: rgba(125, 214, 125, 0.12);color: #7dd67d; border: 1px solid rgba(125, 214, 125, 0.3);}

  .binding-pkg {
    font-size: 0.75rem;
    color: var(--foreground);
    word-break: break-all;
  }

  .binding-status {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .docs-shell {
      grid-template-columns: 1fr;
    }

    .docs-sidebar {
      position: static;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--border);
      padding: 0.75rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .sidebar-label { display: none; }

    .sidebar-item {
      width: auto;
      padding: 0.3125rem 0.625rem;
      font-size: 0.8125rem;
    }

    .docs-content { padding: 1.5rem 1rem; }

    .kv-row { grid-template-columns: 160px 1fr; }
    .kv-type { display: none; }
  }

  @media (max-width: 560px) {
    .section-row { grid-template-columns: 1fr; gap: 0.25rem; }
    .bindings-grid { grid-template-columns: 1fr; }
  }
</style>
