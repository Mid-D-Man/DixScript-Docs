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
</div>
