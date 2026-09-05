<!-- src/lib/components/docs/sections/go/DocGoMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const mergeApi = `// Two or more .mdix source strings — sources[0] has the highest
// implicit weight, sources[len-1] the lowest.
merged, conflicts, err := dixscript.MergeSources(
    []string{baseSrc, overlaySrc},
    dixscript.PrimaryWins,   // or WeightedPriority / SecondaryWins / ThrowOnConflict
    dixscript.ArrayConcatDedup, // or ArrayConcat / ArrayReplace
)
defer merged.Close()

for _, c := range conflicts {
    fmt.Printf("%s: source %d (%s) won\\n", c.Path, c.WinningSource, c.WinningLabel)
}

// Explicit weights instead of positional priority
merged, conflicts, err := dixscript.MergeSourcesWeighted(
    []string{baseSrc, overlaySrc},
    []float64{1.0, 0.5},
    dixscript.WeightedPriority,
    dixscript.ArrayConcatDedup,
)`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#go-api">Go Runtime API</a>. AST-level merge — no
    JSON round-trip, so every DixScript type survives exactly. Conflicts
    are reported per key, never silently resolved without you knowing.
  </p>
  <CodeBlock code={mergeApi} lang="go" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Function / value</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'MergeSources(sources, strategy, arrayStrategy)',        d: 'Merge source strings with implicit descending weights.' },
          { m: 'MergeSourcesWeighted(sources, weights, strategy, arrayStrategy)', d: 'Same, with explicit per-source weights.' },
          { m: 'WeightedPriority',   d: 'Each source\u2019s weight decides the winner; ties favor the lower-indexed source.' },
          { m: 'PrimaryWins / SecondaryWins', d: 'The lower / higher indexed source always wins, regardless of weight.' },
          { m: 'ThrowOnConflict',    d: 'Any key defined by more than one source fails the whole merge.' },
          { m: 'ArrayReplace / ArrayConcat / ArrayConcatDedup', d: 'How array-valued entries combine — replace, concatenate, or concatenate with duplicates removed.' },
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
