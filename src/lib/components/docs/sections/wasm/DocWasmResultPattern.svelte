<!-- src/lib/components/docs/sections/wasm/DocWasmResultPattern.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  server:
    port<int> = 8080
)`;

  const resultPattern = `import { tryGet, tryGetAsync, unwrap, unwrapOr } from "@midmanstudio/mdix";

// tryGet wraps a throwing call into { ok: true, value } | { ok: false, error }
const port = tryGet(() => db.getInt("server.port"));

// Reading a path that doesn't exist in the example file above:
const missing = tryGet(() => db.getString("server.host"));
// missing.ok === false, missing.error is a string message

// unwrapOr — fallback value instead of a branch
const timeout = unwrapOr(tryGet(() => db.getInt("timeout")), 30000);

// unwrap — throws the original error if the result was a failure
// (mostly useful when you've already checked .ok elsewhere)
const hostResult = tryGet(() => db.getString("server.host"));
if (hostResult.ok) {
  const host = unwrap(hostResult); // safe here, .ok already confirmed true
}

// tryGetAsync exists for future async WASM operations — every current
// method in this package is synchronous, so in practice this wraps your
// OWN async code around a call, not an async mdix method:
const remote = await tryGetAsync(async () => {
  const text = await (await fetch("config.mdix")).text();
  return MdixDatabase.loadStr(text);
});`;
</script>

<div class="doc-page">
  <h1>The Result Pattern</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    Every getter throws on failure by default. Wrap calls in
    <code>tryGet</code> for a <code>{'{ ok, value }'} | {'{ ok, error }'}</code>
    result instead — no try/catch needed at the call site.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={resultPattern} lang="javascript" />

  <div class="tip-callout">
    <strong>tryGet vs try/catch, and what tryGetAsync is actually for</strong>
    <ul>
      <li><strong>Use <code>tryGet</code></strong> for a single call you want to handle without a branch that returns/throws — it composes with <code>unwrapOr</code>/<code>unwrap</code> more cleanly than a try/catch block does at a single expression site.</li>
      <li><strong>Use a plain try/catch</strong> when you're wrapping several calls together and want one shared failure path — wrapping each individually in <code>tryGet</code> just to immediately unwrap all of them adds noise without adding safety.</li>
      <li><strong><code>tryGetAsync</code> isn't wrapping an async mdix call</strong> — nothing in this package is actually async yet (it's WASM, everything resolves synchronously once loaded). It exists so your own async code — a <code>fetch()</code>, an IndexedDB read — that happens to call into mdix can use the same result shape as everything else here.</li>
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
