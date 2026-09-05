<!-- src/lib/components/docs/sections/java/DocJavaMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const mergeApi = `// Source strings — sources[0] gets the highest implicit weight
Merge.Result merged = Merge.sources(baseSrc, overlaySrc);
Database db = merged.database;
if (merged.hasConflicts()) {
    for (Merge.Conflict c : merged.conflicts) {
        System.out.println(c.path + ": source " + c.winningSource + " (" + c.winningLabel + ") won");
    }
}

// Explicit weights + strategy
Merge.Result weighted = Merge.sourcesWeighted(
    List.of(baseSrc, overlaySrc),
    new double[]{ 1.0, 0.5 },
    Merge.Strategy.WEIGHTED_PRIORITY,
    Merge.ArrayStrategy.CONCAT_DEDUP
);

// Already-loaded Databases instead of source text — each is round-tripped
// through toMdix() first, since a loaded Database only retains resolved
// data, not the AST the merger needs for weighted conflict resolution.
Merge.Result fromDbs = Merge.databases(baseDb, overlayDb);`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.
    <code>Merge</code> — AST-level merge, no JSON round-trip. Works from
    either raw source strings (<code>Merge.sources</code>) or
    already-loaded <code>Database</code> instances
    (<code>Merge.databases</code>).
  </p>
  <CodeBlock code={mergeApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method / value</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'Merge.sources(...) / Merge.sourcesWeighted(...)', d: 'Merge raw source strings, with implicit or explicit weights.' },
          { m: 'Merge.databases(...) / Merge.databasesWeighted(...)', d: 'Merge already-loaded Database instances.' },
          { m: 'Result.database / Result.conflicts / Result.hasConflicts()', d: 'The merged database, the per-key conflict list, and a quick boolean check.' },
          { m: 'Strategy.WEIGHTED_PRIORITY',    d: 'Each source\u2019s weight decides the winner; ties favor the lower-indexed source.' },
          { m: 'Strategy.PRIMARY_WINS / SECONDARY_WINS', d: 'The lower / higher indexed source always wins, regardless of weight.' },
          { m: 'Strategy.THROW_ON_CONFLICT',    d: 'Any key defined by more than one source fails the whole merge.' },
          { m: 'ArrayStrategy.REPLACE / CONCAT / CONCAT_DEDUP', d: 'How array-valued entries combine.' },
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
