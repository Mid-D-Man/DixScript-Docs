<!-- src/lib/components/docs/sections/wasm/DocWasmMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const baseMdix = `// base
@DATA(
  app_name = "MyApp"
  port<int> = 8080

  admins:: "alice", "bob"
)`;

  const overlayMdix = `// local overrides
@DATA(
  port<int> = 3000

  admins:: "carol"
)`;

  const mergeApi = `import { mergeSources, mergeSourcesWeighted } from "@midmanstudio/mdix";

// Sources are weighted in descending order by position — sources[0]
// gets weight 1.0, the last gets the lowest weight (only matters under
// the "weighted" strategy, the default).
const outcome = mergeSources(
  [baseSource, overlaySource],
  "primary_wins",    // "weighted" | "primary_wins" | "secondary_wins" | "throw_on_conflict"
  "concat_dedup",     // "replace" | "concat" | "concat_dedup" — array-shaped values
);
const merged = outcome.database();      // MdixDatabase — free() it when done
const conflicts = outcome.conflicts();  // array of { path, winningSource, winningLabel }
// merged.getInt("port") === 8080 — base (primary) wins the scalar conflict
// merged.getArray("admins") === ["alice", "bob", "carol"] — arrays concat-dedup
// regardless of which side "won" the scalar conflicts

// Explicit [source, weight] pairs instead of positional weighting —
// also takes strategy/arrayStrategy, same as mergeSources
const weighted = mergeSourcesWeighted(
  [[baseSource, 1.0], [overlaySource, 0.5]],
  "weighted",
  "concat_dedup",
);

// Merge into an already-loaded database instead of raw source strings
const combined = db.mergeWith(otherDb, "primary_wins", "concat_dedup");`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    AST-level merge — no JSON round-trip, so every DixScript type
    survives the merge exactly.
  </p>

  <h2>Example — base config + local override</h2>
  <CodeBlock code={baseMdix} lang="dixscript" />
  <CodeBlock code={overlayMdix} lang="dixscript" />

  <CodeBlock code={mergeApi} lang="javascript" />

  <div class="tip-callout">
    <strong>mergeSources vs db.mergeWith</strong>
    <ul>
      <li><strong>Use <code>mergeSources</code>/<code>mergeSourcesWeighted</code></strong> when you have raw <code>.mdix</code> text and don't need a loaded database for anything else first — skips a load step.</li>
      <li><strong>Use <code>db.mergeWith(other, ...)</code></strong> when you already have two loaded <code>MdixDatabase</code> instances for other reasons and want to combine them without re-parsing from source.</li>
      <li><strong>Every merge result is an <code>MdixMergeOutcome</code>, not a bare database</strong> — call <code>.database()</code> for the merged data and <code>.conflicts()</code> if you want to know what got resolved and how. Both source objects (<code>outcome</code> and the original databases) still need their own <code>.free()</code> — merging doesn't consume or free its inputs.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'mergeSources(sources, strategy?, arrayStrategy?)',        d: 'Merge raw .mdix source strings, auto-weighted by position.' },
          { m: 'mergeSourcesWeighted(entries, strategy?, arrayStrategy?)', d: 'Same, with explicit [source, weight] pairs.' },
          { m: 'db.mergeWith(other, strategy?, arrayStrategy?)',          d: 'Merge two already-loaded databases.' },
          { m: 'outcome.database()',                                      d: 'The merged MdixDatabase.' },
          { m: 'outcome.conflicts()',                                     d: 'Array of { path, winningSource, winningLabel }.' },
          { m: '"weighted" / "primary_wins" / "secondary_wins" / "throw_on_conflict"', d: 'Scalar/table conflict strategies.' },
          { m: '"replace" / "concat" / "concat_dedup"',                   d: 'Array-value merge strategies. concat_dedup is the default.' },
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
