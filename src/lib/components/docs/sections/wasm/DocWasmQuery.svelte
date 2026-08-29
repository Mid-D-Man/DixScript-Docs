<!-- src/lib/components/docs/sections/wasm/DocWasmQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const queryApi = `import { query, queryMany } from "@midmanstudio/mdix";

// Unlike the other bindings, this is NOT a chainable Query object — it's
// a plain typed array. Use native Array methods on the result directly.
interface Enemy { name: string; hp: number; }

const boss = query<Enemy>(db, "enemies")
  .filter(e => e.hp > 100)              // where_
  .sort((a, b) => b.hp - a.hp)[0];      // order_by_desc + first

const names = query<Enemy>(db, "enemies").map(e => e.name);   // select
const total = query<Enemy>(db, "enemies")
  .reduce((sum, e) => sum + e.hp, 0);    // sum_int

// queryMany — whole-segment glob across sibling paths ("*" only), same
// pattern syntax as the core's select_many
const statuses = queryMany<string>(db, "servers.*.status");

// Returns [] for a path that doesn't exist or isn't array-shaped —
// that's a normal "no match", not an error.`;
</script>

<div class="doc-page">
  <h1>Query</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    Deliberately not a chainable query object — <code>query()</code> and
    <code>queryMany()</code> just parse the native side's JSON output into
    a plain typed array, and hand it back to you. Use ordinary
    <code>Array</code> methods (<code>.filter</code>, <code>.sort</code>,
    <code>.map</code>, <code>.reduce</code>) instead of a bespoke chain API.
  </p>
  <CodeBlock code={queryApi} lang="javascript" />
</div>
