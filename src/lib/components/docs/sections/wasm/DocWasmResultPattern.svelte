<!-- src/lib/components/docs/sections/wasm/DocWasmResultPattern.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const resultPattern = `import { tryGet, tryGetAsync, unwrap, unwrapOr } from "@midmanstudio/mdix";

// tryGet wraps a throwing call into { ok: true, value } | { ok: false, error }
const port = tryGet(() => db.getInt("port"));

// unwrapOr — fallback value instead of a branch
const timeout = unwrapOr(tryGet(() => db.getInt("timeout")), 30000);

// unwrap — throws the original error if the result was a failure
// (mostly useful when you've already checked .ok elsewhere)
const host = unwrap(tryGet(() => db.getString("server.host")));

// tryGetAsync — same pattern for anything that returns a Promise
const remote = await tryGetAsync(async () => fetchAndLoad("config.mdix"));`;
</script>

<div class="doc-page">
  <h1>The Result Pattern</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    Every getter throws on failure by default. Wrap calls in
    <code>tryGet</code> for a <code>{'{ ok, value }'} | {'{ ok, error }'}</code>
    result instead — no try/catch needed at the call site.
  </p>
  <CodeBlock code={resultPattern} lang="javascript" />
</div>
