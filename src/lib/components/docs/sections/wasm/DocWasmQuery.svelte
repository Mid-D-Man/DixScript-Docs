<!-- src/lib/components/docs/sections/wasm/DocWasmQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  enemies::
    { name = "Goblin", hp<int> = 50  },
    { name = "Orc",    hp<int> = 100 },
    { name = "Dragon", hp<int> = 500 }
)`;

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

  const cheatSheet = `// The Rust core's DixQuery chain (dixscript/src/Runtime/query.rs) isn't
// ported to JS as its own chainable API — every one of its operations
// works on plain data, which once query()/queryMany() decode the JSON
// is exactly what you already have. Cheat sheet:

arr.length                                    // count()
arr.some(pred)                                // any(pred)
arr.every(pred)                               // all(pred)
arr[0]                                        // first()
arr.at(-1)                                    // last()
arr[i]                                        // nth(i)
arr.reduce((a, b) => a + b.field, 0)          // sum_int() / sum_float()
arr.reduce((a, b) => a + b.field, 0) / arr.length  // avg_float()

// group_by(keyFn):
arr.reduce((m, x) => (m.set(keyFn(x), [...(m.get(keyFn(x)) ?? []), x]), m), new Map())

// distinct() — primitives:
[...new Set(arr)]
// distinct() — objects, keyed by whatever makes two elements "the same":
[...new Map(arr.map(x => [x.id, x])).values()]`;
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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={queryApi} lang="javascript" />

  <h2>Full cheat sheet</h2>
  <p>Every other <code>DixQuery</code> method the Rust core has, mapped to native <code>Array</code>/<code>Map</code>/<code>Set</code> operations.</p>
  <CodeBlock code={cheatSheet} lang="javascript" />

  <div class="tip-callout">
    <strong>Why no chainable object here</strong>
    <ul>
      <li>Every other language binding wraps a native query chain because their languages don't already have one built in as ergonomically. JavaScript's <code>Array</code> already <em>is</em> that chain — wrapping it in a second API would just be indirection with no real benefit.</li>
      <li><strong>Use <code>query</code></strong> for a single array at a known path. <strong>Use <code>queryMany</code></strong> only for the wildcard case — gathering the same field across sibling tables, resolved natively rather than looped client-side.</li>
      <li><strong>An empty result is not an error</strong> — a typo'd path and a genuinely empty array look identical (<code>[]</code>). If that distinction matters, check <code>db.exists(path)</code> first.</li>
    </ul>
  </div>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Rust core concept</th><th>JS equivalent</th></tr></thead>
      <tbody>
        {#each [
          { m: 'query(db, path)',       d: 'A single array at a known path — returns a plain typed array.' },
          { m: 'queryMany(db, pattern)', d: 'Whole-segment "*" glob across sibling paths, resolved natively.' },
          { m: 'where_(pred) / select(map)', d: 'arr.filter(pred) / arr.map(map)' },
          { m: 'order_by / order_by_desc',    d: 'arr.sort((a,b) => …)' },
          { m: 'count() / any(pred) / all(pred)', d: 'arr.length / arr.some(pred) / arr.every(pred)' },
          { m: 'first() / last() / nth(i)',   d: 'arr[0] / arr.at(-1) / arr[i]' },
          { m: 'sum_int/sum_float(key) / avg_float(key)', d: 'arr.reduce((a,b) => a + b.field, 0), divided by arr.length for the average' },
          { m: 'group_by(key)',               d: 'arr.reduce(...) into a Map' },
          { m: 'distinct()',                  d: '[...new Set(arr)] for primitives, a Map keyed by id for objects' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
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
