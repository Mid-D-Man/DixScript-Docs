<!-- src/lib/components/docs/sections/wasm/DocWasmMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const mergeApi = `import { mergeSources, mergeSourcesWeighted } from "@midmanstudio/mdix";

// Sources are weighted in descending order by position — sources[0]
// gets weight 1.0, the last gets the lowest weight (only matters under
// the "weighted" strategy, the default).
const outcome = mergeSources(
  [sourceA, sourceB],
  "primary_wins",    // "weighted" | "primary_wins" | "secondary_wins" | "throw_on_conflict"
  "concat_dedup",     // "replace" | "concat" | "concat_dedup" — array-shaped values
);
const merged = outcome.database();      // MdixDatabase — free() it when done
const conflicts = outcome.conflicts();  // array of { path, winningSource, winningLabel }

// Explicit [source, weight] pairs instead of positional weighting
const weighted = mergeSourcesWeighted([[sourceA, 1.0], [sourceB, 0.5]]);

// Merge into an already-loaded database instead of raw source strings
const combined = db.mergeWith(otherDb, "primary_wins", "concat_dedup");`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    AST-level merge — no JSON round-trip, so every DixScript type
    survives the merge exactly. Works from raw source strings
    (<code>mergeSources</code>) or from an already-loaded database
    (<code>db.mergeWith(other, ...)</code>).
  </p>
  <CodeBlock code={mergeApi} lang="javascript" />
</div>
