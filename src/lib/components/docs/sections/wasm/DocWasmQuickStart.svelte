<!-- src/lib/components/docs/sections/wasm/DocWasmQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  port<int> = 8080
  ssl = true
)`;

  const quickStart = `import { MdixDatabase, tryGet } from "@midmanstudio/mdix";

// Load from a .mdix source string — the file above, inlined
const db = MdixDatabase.loadStr(\`
  @DATA(
    app_name = "MyApp"
    port<int> = 8080
    ssl = true
  )
\`);

// Direct access — throws on error
const name = db.getString("app_name"); // "MyApp"
const port = db.getInt("port");        // 8080

// Safe access — returns MdixResult<T>, never throws
const result = tryGet(() => db.getString("missing_key"));
if (result.ok) console.log(result.value);
else           console.error(result.error);

db.free(); // WASM memory is not GC'd — always free() when done`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.</p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={quickStart} lang="javascript" />

  <div class="tip-callout">
    <strong>Direct access vs tryGet, and don't forget free()</strong>
    <ul>
      <li><strong>Use direct access</strong> (<code>db.getString(...)</code>) for fields the app can't run without — same reasoning as every other binding: let a missing required field fail loudly.</li>
      <li><strong>Use <code>tryGet</code></strong> for anything optional, or when you're reading a batch of fields and want to collect failures instead of stopping at the first one.</li>
      <li><strong>Always call <code>.free()</code></strong> when you're done with an <code>MdixDatabase</code> or <code>MdixBuilder</code> — WASM linear memory isn't garbage collected by the JS engine, so a forgotten <code>free()</code> is a real, silent leak, not just a style nitpick. In a component-based UI, free it in the cleanup path (React's effect cleanup, Svelte's <code>onDestroy</code>) rather than only on the happy path.</li>
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
