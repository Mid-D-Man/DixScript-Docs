<!-- src/lib/components/docs/sections/odin/DocOdinMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const mergeApi = `import "mdix"

// Sources weighted by position — sources[0] highest, only matters under
// .Weighted_Priority (merge_sources defaults to .Primary_Wins instead).
db, conflicts, ok := mdix.merge_sources(
    { base_src, overlay_src },
    mdix.Primary_Wins,
    mdix.Array_Concat_Dedup,
)
defer mdix.destroy(&db)
defer delete(conflicts)

for c in conflicts {
    fmt.printfln("%s: source %d (%s) won", c.path, c.winning_source, c.winning_label)
}

// Explicit per-source weights
weighted_db, _, ok2 := mdix.merge_sources_weighted(
    { base_src, overlay_src },
    { 1.0, 0.5 },
    mdix.Weighted_Priority,
    mdix.Array_Concat_Dedup,
)`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#odin-api">Odin Runtime API</a>. AST-level merge,
    not a JSON round-trip — every DixScript type
    (Long/Float/Double/Hex_Color/Blob/Regex/Date/Timestamp/Enum) survives
    exactly, and conflicts are reported per key.
  </p>
  <CodeBlock code={mergeApi} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure / value</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'merge_sources(sources, strategy, arrayStrategy)', d: 'Merge source strings; note the default strategy here is Primary_Wins, not weighted.' },
          { m: 'merge_sources_weighted(sources, weights, strategy, arrayStrategy)', d: 'Same, with explicit per-source weights.' },
          { m: 'Weighted_Priority',   d: 'Each source\u2019s weight decides the winner; ties favor the lower-indexed source.' },
          { m: 'Primary_Wins / Secondary_Wins', d: 'The lower / higher indexed source always wins, regardless of weight.' },
          { m: 'Throw_On_Conflict',   d: 'Any key defined by more than one source fails the whole merge.' },
          { m: 'Array_Replace / Array_Concat / Array_Concat_Dedup', d: 'How array-valued entries combine.' },
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
