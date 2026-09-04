<!-- src/lib/components/docs/sections/php/DocPhpMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const mergePhp = `use MidManStudio\\Mdix\\MdixMerge;
use MidManStudio\\Mdix\\MergeStrategy;
use MidManStudio\\Mdix\\ArrayMergeStrategy;

$result = MdixMerge::sources(
    $primarySource, $secondarySource,
    strategy: MergeStrategy::WeightedPriority,
    arrayStrategy: ArrayMergeStrategy::ConcatDedup,
);

if ($result->hasConflicts()) {
    foreach ($result->conflicts as $c) {
        echo "{$c->path} -> source {$c->winningSource} ({$c->winningLabel})\\n";
    }
}
$db = $result->database;

// Explicit per-source weights instead of the default descending 1.0 -> 0.0
$result2 = MdixMerge::sourcesWeighted(
    [$primarySource, $secondarySource],
    [0.8, 0.2],
    strategy: MergeStrategy::PrimaryWins,
);

// Merging already-loaded databases instead of raw source strings
$result3 = MdixMerge::databases($db1, $db2);`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. Real AST-level merge
    — weighted-priority conflict resolution, per-source conflict reporting,
    full type fidelity — not a shallow array merge.
  </p>

  <CodeBlock code={mergePhp} lang="php" />

  <p>
    <code>MergeStrategy</code>: <code>WeightedPriority</code> (default —
    each source's weight decides the winner, ties favor the lower-indexed
    source), <code>PrimaryWins</code>, <code>SecondaryWins</code>, or
    <code>ThrowOnConflict</code> (any contested key fails the whole merge).
    <code>ArrayMergeStrategy</code>: <code>ConcatDedup</code> (default),
    <code>Concat</code>, or <code>Replace</code> — governs how array-valued
    entries from different sources combine.
  </p>
</div>
