<!-- src/lib/components/docs/sections/wasm/DocWasmFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@CONFIG(
  version -> "1.0.0"
)

@DATA(
  name = "MyApp"
  port<int> = 8080
)`;

  const converterApi = `import { MdixDatabase } from "@midmanstudio/mdix";

// Import from foreign formats
const fromJson = MdixDatabase.fromJson(JSON.stringify({ name: "MyApp", port: 8080 }));
const fromToml = MdixDatabase.fromToml('name = "MyApp"\\nport = 8080\\n');

// Export — instance methods, available on any loaded MdixDatabase
// (see Reading Values). toMdix() takes no format-mode argument in this
// build — always the default style, unlike the Rust core's DixFormatOptions.
const json = fromJson.toJson(true);  // pretty-printed
const toml = fromJson.toToml();
const mdix = fromJson.toMdix();`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={converterApi} lang="javascript" />

  <div class="tip-callout">
    <strong>Avoid JSON as a save format</strong>
    <ul>
      <li>Same caveat as every other binding's format conversion page: JSON has no <code>Long</code>/<code>Date</code>/<code>HexColor</code>/<code>Enum</code> types, so <code>toJson()</code> loses type information that <code>toMdix()</code> preserves exactly. Use JSON for interop outside the DixScript ecosystem — sending data to a REST API, say — and <code>toMdix()</code> for anything you'll <code>loadStr()</code> again later.</li>
      <li><strong>No source-text formatting helpers here</strong> — unlike the Rust core (<code>DixCompactor</code>) or other bindings, this build only converts already-loaded <code>MdixDatabase</code> instances between formats; there's no <code>formatSource</code>/<code>minifySource</code> that operates on raw text without loading it first.</li>
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
