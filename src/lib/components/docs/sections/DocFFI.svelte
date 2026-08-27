<!-- src/lib/components/docs/sections/DocFFI.svelte -->
<script lang="ts">
  interface Binding {
    lang: string;
    pkg: string;
    cls: string;
    status: 'complete' | 'mostly' | 'partial' | 'not-ready';
    statusLabel: string;
    note: string;
  }

  const bindings: Binding[] = [
    {
      lang: 'C# / Unity', pkg: 'MidManStudio.Mdix.Core', cls: 'cs',
      status: 'complete', statusLabel: 'Feature-complete',
      note: 'The most complete wrapper. Static Dix facade, MdixDatabase, MdixBuilder, MdixConverter, plus merge (MdixMerge), wildcard query (MdixQuery), schema (MdixSchema), dynamic access (MdixDynamic), and POCO deserialization via Dix.Deserialize<T>(). Full async surface. NuGet packaging still pending.'
    },
    {
      lang: 'Go', pkg: 'github.com/Mid-D-Man/dixscript-go', cls: 'go',
      status: 'complete', statusLabel: 'Feature-complete',
      note: 'Idiomatic (value, error) API over cgo. Load / LoadStr / LoadEncrypted(Password) / LoadJSON / LoadToml, typed getters including HexColor/Blob/MdixRegex/MdixDate, Builder, a Convert namespace for JSON/TOML/format/minify, generic Query[T] (Where/Select/OrderBy/GroupBy/Sum/Avg), SchemaBuilder, MergeSources(Weighted), and poll-based hot reload.'
    },
    {
      lang: 'Java / Kotlin', pkg: 'com.midmanstudio.dixscript', cls: 'java',
      status: 'complete', statusLabel: 'Feature-complete — exception-based',
      note: 'DixScript facade, Database (typed getters with defaults, enum accessors, arrayLength, getJson, keys), Builder, Converter (JSON/TOML/format/minify/round-trip), MdixQuery (chainable query/queryMany), SchemaBuilder, and Merge (source- or Database-based, weighted strategies). Uses MdixException rather than a Result type. No async layer, unlike C#.'
    },
    {
      lang: 'PHP', pkg: 'midmanstudio/mdix', cls: 'php',
      status: 'complete', statusLabel: 'Feature-complete',
      note: 'Both throw-style methods and try*() railway-style methods returning MdixResult (map / andThen / ensure / fold / tap chains, same pattern as the Python wrapper). Full MdixBuilder and MdixConverter. Composer installs the wrapper class only — FFI needs the compiled native library built separately, see the Install section.'
    },
    {
      lang: 'Python', pkg: 'midmanstudio-mdix', cls: 'python',
      status: 'complete', statusLabel: 'Feature-complete',
      note: 'PyO3 bindings, pre-built wheels — no Rust toolchain required. MdixDatabase / MdixBuilder with a full railway-style MdixResult (and_then, ensure, map, fold, tap, unwrap_or). Two-tier @DATA ordering enforced by the builder.'
    },
    {
      lang: 'WebAssembly (crate)', pkg: 'mdix-wasm', cls: 'wasm',
      status: 'complete', statusLabel: 'Feature-complete at the crate level',
      note: 'wasm-bindgen exports for MdixDatabase and MdixBuilder, plus features not yet surfaced in the npm package below: merge (mergeSources / mergeSourcesWeighted / mergeWith), MdixSchema (fluent require_*/optional_* validation), and MdixWatcher (source hot-reload / change detection).'
    },
    {
      lang: 'JS / npm', pkg: '@midmanstudio/mdix', cls: 'wasm',
      status: 'complete', statusLabel: 'Published — full mdix-wasm surface',
      note: 'MdixDatabase and MdixBuilder, plus merge (mergeSources / mergeSourcesWeighted / mergeWith), MdixSchema (fluent require_*/optional_* validation), DLM compile/decompile, and MdixWatcher (source hot-reload) are all re-exported from src/index.ts now — this used to lag the underlying mdix-wasm crate, that gap is closed.'
    },
    {
      lang: 'Odin', pkg: 'mdix-odin', cls: 'odin',
      status: 'complete', statusLabel: 'Feature-complete',
      note: 'The broadest raw surface of any wrapper: (value, ok) getters for every type, select_many_as_json for wildcard queries, format_source/minify_source/compact_source/strip_comments, and a full builder_* procedure set. Idiomatic Odin — no exceptions, no hidden allocation (caller-owned strings via an explicit allocator param).'
    },
    {
      lang: 'C / C++', pkg: 'mdix-c', cls: 'c',
      status: 'complete', statusLabel: 'Feature-complete',
      note: 'Pre-built native library + headers, distributed as a zip via GitHub Actions artifacts / Releases. mdix.h for C (null-sentinel + mdix_get_last_error()), mdix.hpp for C++ (RAII Database/Builder with optional-style returns). CMake integration via add_subdirectory + mdix::mdix.'
    },
    {
      lang: 'Lua', pkg: 'mdix-lua', cls: 'lua',
      status: 'not-ready', statusLabel: 'Not production ready (upstream\u2019s own label)',
      note: 'require("mdix") — get/get_string/get_int/... with optional defaults, full Builder with two-tier ordering, pcall-based error handling. The package\u2019s own README states the runtime is incomplete and the API may still change; treat it as pre-release.'
    },
  ];

  const statusDot: Record<Binding['status'], string> = {
    complete:   '#22c55e',
    mostly:     '#eab308',
    partial:    '#eab308',
    'not-ready':'#f97316',
  };
</script>

<div class="doc-page">
  <h1>Language Bindings</h1>
  <p class="page-lead">
    Every wrapper binds to the Rust core (<code>dixscript</code>) via FFI — one
    compiler, one runtime, one set of DLM/security guarantees, wrapped in each
    language's own idioms. Status below reflects each package's own source and
    README, not a blanket "pending" label — several bindings are considerably
    further along than the top-level project status has previously suggested.
  </p>

  <div class="bindings-grid">
    {#each bindings as b}
      <div class="binding-card">
        <div class="binding-lang binding-lang--{b.cls}">{b.lang}</div>
        <code class="binding-pkg">{b.pkg}</code>
        <div class="binding-status">
          <span class="status-dot" style="background:{statusDot[b.status]}"></span>
          {b.statusLabel}
        </div>
        <p class="binding-note">{b.note}</p>
      </div>
    {/each}
  </div>

  <p>
    Full method-by-method reference for each language lives under
    <strong>Tools &amp; Bindings</strong> in the sidebar. Track build/test status on the
    <a href="/results">CI Results</a> page or in the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer">Rust repo</a>.
  </p>

  <h2>Used in the wild</h2>
  <p>
    DixScript isn't just a config format on paper — it's the source format
    behind two other MidManStudio projects. Both are worth a look if you want
    to see QuickFuncs and the two-tier <code>@DATA</code> model applied to
    something other than app config.
  </p>

  <div class="ecosystem-grid">
    <div class="ecosystem-card">
      <h3>MSX — MidStroke eXchange</h3>
      <p>
        A vector-image format where the source file <em>is</em> a DixScript
        (<code>.msx</code>) document. QuickFuncs act as parametric shape
        generators and reusable component libraries instead of app config
        values — the same <code>@QUICKFUNCS</code> / <code>@DATA</code>
        structure documented on this site, applied to a scene graph. The
        compiled binary is then run back through MBFA (MidMans Bit Folding
        Algorithm) for compression, and can round-trip out to SVG.
      </p>
      <a href="https://github.com/Mid-D-Man/msx" target="_blank" rel="noopener noreferrer" class="ecosystem-link">
        github.com/Mid-D-Man/msx →
      </a>
    </div>

    <div class="ecosystem-card">
      <h3>mdix-scaffold</h3>
      <p>
        A declarative, idempotent project-structure generator: describe a
        repo's file/folder layout once in a <code>.mdix</code> template
        (QuickFuncs like <code>f()</code>, <code>fc()</code>, and
        <code>fremote()</code> for stub files, files with inline content, and
        files fetched from a URL at generation time), then run it as a
        reusable GitHub Actions workflow or a local Node.js CLI. Only new
        entries are added — existing files are left alone unless you opt in
        to overwriting stubs.
      </p>
      <a href="https://github.com/Mid-D-Man/mdix-scaffold" target="_blank" rel="noopener noreferrer" class="ecosystem-link">
        github.com/Mid-D-Man/mdix-scaffold →
      </a>
    </div>
  </div>
</div>

<style>
  .bindings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 0.875rem;
    margin: 1.25rem 0 1.5rem;
  }

  .binding-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.875rem;
    background: var(--secondary);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .binding-pkg {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    word-break: break-word;
  }

  .binding-status {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .binding-note {
    font-size: 0.78125rem;
    line-height: 1.5;
    color: var(--muted-foreground);
    margin: 0;
  }

  .binding-lang {
    display: inline-block;
    width: fit-content;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .binding-lang--cs     { background: rgba(155,77,202,.12);  color: #9b4dca; border: 1px solid rgba(155,77,202,.3);  }
  .binding-lang--go     { background: rgba(0,172,215,.12);   color: #00acd7; border: 1px solid rgba(0,172,215,.3);   }
  .binding-lang--java   { background: rgba(248,152,32,.12);  color: #f89820; border: 1px solid rgba(248,152,32,.3);  }
  .binding-lang--python { background: rgba(46,168,160,.12);  color: #2ea8a0; border: 1px solid rgba(46,168,160,.3);  }
  .binding-lang--php    { background: rgba(136,146,191,.12); color: #8892bf; border: 1px solid rgba(136,146,191,.3); }
  .binding-lang--wasm   { background: rgba(125,214,125,.12); color: #5aab5a; border: 1px solid rgba(125,214,125,.3); }
  .binding-lang--odin   { background: rgba(51,154,240,.12);  color: #339af0; border: 1px solid rgba(51,154,240,.3);  }
  .binding-lang--c      { background: rgba(160,160,160,.12); color: #a0a0a0; border: 1px solid rgba(160,160,160,.3); }
  .binding-lang--lua    { background: rgba(0,0,128,.12);     color: #6a6aff; border: 1px solid rgba(0,0,128,.3);     }

  .ecosystem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .ecosystem-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
  }

  .ecosystem-card h3 {
    margin-top: 0;
    font-size: 0.9375rem;
  }

  .ecosystem-card p {
    font-size: 0.8125rem;
    line-height: 1.55;
    color: var(--muted-foreground);
  }

  .ecosystem-link {
    display: inline-block;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--primary);
    text-decoration: none;
  }
  .ecosystem-link:hover { text-decoration: underline; }
</style>
