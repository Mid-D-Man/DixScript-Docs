<!-- src/lib/components/docs/sections/c/DocCFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const convertC = `// Export
char* json = mdix_to_json(db, true);              // indented; false for compact
char* toml = mdix_to_toml(db);
char* mdix = (char*) mdix_to_mdix(db, MDIX_FORMAT_PRETTY); // returns void*, cast back

// Foreign format import — returns a new handle, free with mdix_free()
void* fromJson = mdix_from_json(json_string);
void* fromToml = mdix_from_toml(toml_string);

// Source-text transforms (operate on raw source, no handle involved)
char* formatted = mdix_format_source(source, MDIX_FORMAT_PRETTY);
char* minified   = mdix_minify_source(source);
char* compacted  = mdix_compact_source(source);
char* stripped   = mdix_strip_comments(source);

// Syntax check only — NOT schema validation
bool ok = mdix_validate(source);

mdix_free_string(json); mdix_free_string(toml); mdix_free_string(mdix);
mdix_free_string(formatted); mdix_free_string(minified);
mdix_free_string(compacted); mdix_free_string(stripped);
mdix_free(fromJson); mdix_free(fromToml);`;

  const convertCpp = `auto json = db->to_json();          // Result<std::string>, indented=true by default
auto toml = db->to_toml();
auto mdix = db->to_mdix(MDIX_FORMAT_PRETTY);

auto fromJson = mdix::Database::from_json(json_string);
auto fromToml = mdix::Database::from_toml(toml_string);

auto formatted = mdix::format_source(source, MDIX_FORMAT_PRETTY);
auto minified   = mdix::minify_source(source);
auto compacted  = mdix::compact_source(source);
auto stripped   = mdix::strip_comments(source);

bool ok = mdix::validate(source);`;
</script>

<div class="doc-page">
  <h1>Format &amp; Conversion</h1>
  <p class="page-lead">Part of the <a href="#c-api">C / C++ Runtime API</a>.</p>

  <CodeBlock code={convertC} lang="c" />
  <CodeBlock code={convertCpp} lang="cpp" />

  <h2>MdixFormatMode</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Value</th><th>Used by</th></tr></thead>
      <tbody>
        <tr><td><code>DEFAULT</code></td><td>Whatever the source's own existing style implies.</td></tr>
        <tr><td><code>PRETTY</code></td><td>Fully expanded, indented — the readable form.</td></tr>
        <tr><td><code>COMPACT</code></td><td>Reduced whitespace, structure and comments kept.</td></tr>
        <tr><td><code>MINIFIED</code></td><td>Smallest possible output.</td></tr>
      </tbody>
    </table>
  </div>

  <div class="tip-callout">
    <strong>compact vs minify vs strip_comments</strong>
    <ul>
      <li><code>compact_source</code> removes blank/redundant whitespace only — comments and overall structure are untouched.</li>
      <li><code>minify_source</code> is the more aggressive pass — everything <code>compact_source</code> does, plus further size reduction.</li>
      <li><code>strip_comments</code> removes line and block comments specifically, leaving formatting otherwise untouched — orthogonal to the other two, combine as needed.</li>
      <li><code>mdix_validate</code> / <code>mdix::validate</code> checks syntax only ("does it parse") — it is <em>not</em> schema validation against expected fields or types.</li>
    </ul>
  </div>
</div>

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
