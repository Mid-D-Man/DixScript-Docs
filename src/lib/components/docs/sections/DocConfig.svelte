<!-- src/lib/components/docs/sections/DocConfig.svelte -->
<script lang="ts">
  const example = `@CONFIG(
  version            -> "1.0.0"
  encoding           -> "utf-8"
  author             -> "Your Name"
  features           -> "advanced"
  debug_mode         -> "off"
  error_handling     -> "halt"
  compatibility_mode -> "strict"
)`;

  const basicExample = `@CONFIG(
  version  -> "1.0.0"
  features -> "basic"
)

// With features = "basic" these sections are UNAVAILABLE:
// @ENUMS, @QUICKFUNCS, @DLM, @IMPORTS`;

  const advancedExample = `// No @CONFIG at all — features default to "advanced"

@ENUMS(
  Status { ACTIVE, INACTIVE }   // works fine without @CONFIG
)

@QUICKFUNCS(
  ~item<object>(id, name) { return { id = id, name = name } }
)

@DATA(
  entry = item("001", "First")
)`;
</script>

<div class="doc-page">
  <h1>@CONFIG</h1>
  <p class="page-lead">
    Controls compiler behaviour and stores file metadata. The entire section is optional.
    All keys within it are also optional — include only what you need.
    When <code>@CONFIG</code> is omitted entirely, advanced features are available by default.
  </p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'version',            type: 'string',   desc: 'File version string — metadata only. Example: "1.0.0"' },
      { key: 'encoding',           type: 'string',   desc: 'Metadata only — does not affect compilation. "utf-8" | "utf-16" | "ascii"' },
      { key: 'author',             type: 'string',   desc: 'Author name or identifier — metadata only.' },
      { key: 'features',           type: 'string',   desc: '"advanced" (default) enables all sections. "basic" restricts to @DATA only.' },
      { key: 'debug_mode',         type: 'enum',     desc: '"off" (default) | "regular" — enables Dix.Log output | "verbose"' },
      { key: 'error_handling',     type: 'enum',     desc: '"halt" (default) | "continue" | "recover"' },
      { key: 'compatibility_mode', type: 'enum',     desc: '"strict" (default) | "best_effort" | "permissive"' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Features: "advanced" Is the Default</h2>
  <p>
    If <code>features</code> is not set — or if <code>@CONFIG</code> is omitted entirely —
    the compiler treats the file as if <code>features -> "advanced"</code> were declared.
    Advanced features include <code>@ENUMS</code>, <code>@QUICKFUNCS</code>, <code>@DLM</code>,
    and <code>@IMPORTS</code>. Setting <code>features -> "basic"</code> explicitly opts out
    of these, leaving only <code>@DATA</code> available.
  </p>

  <div class="tier-grid">
    <div class="tier-card">
      <div class="tier-label">Basic — explicit opt-out of advanced features</div>
      <pre class="tier-pre"><code>{basicExample}</code></pre>
    </div>
    <div class="tier-card">
      <div class="tier-label">Advanced — the default, no @CONFIG needed</div>
      <pre class="tier-pre"><code>{advancedExample}</code></pre>
    </div>
  </div>

  <h2>Encoding Note</h2>
  <p>
    The <code>encoding</code> key is purely informational metadata. It is stored in the
    compiled output for downstream tooling to read, but the DixScript compiler itself
    always reads source files as UTF-8 regardless of what this field contains.
  </p>

  <h2>Debug Mode and Dix.Log</h2>
  <p>
    <code>Dix.Log</code>, <code>Dix.LogInfo</code>, <code>Dix.LogWarning</code>, and similar
    calls inside <code>@QUICKFUNCS</code> only produce output when <code>debug_mode</code>
    is set to <code>"regular"</code> or <code>"verbose"</code>. With <code>"off"</code>
    (the default) all log calls are silently discarded.
    <code>Dix.LogVerbose</code> only fires when mode is <code>"verbose"</code>.
  </p>
</div>
