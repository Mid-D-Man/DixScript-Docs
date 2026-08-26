<!-- src/lib/components/docs/sections/rust/DocRustMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const mergeApi = `use dixscript::Runtime::{MdixMerger, MdixMergeInput, MdixMergeStrategy, ArrayMergeStrategy};

// Two sources
let merger = MdixMerger::new()
    .with_strategy(MdixMergeStrategy::WeightedPriority) // or PrimaryWins / SecondaryWins / ThrowOnConflict
    .with_array_strategy(ArrayMergeStrategy::ConcatDedup); // or Concat / Replace

let primary   = MdixMergeInput::new(base_ast).with_weight(1.0).with_label("base");
let secondary = MdixMergeInput::new(overlay_ast).with_weight(0.5).with_label("overlay");

let result = merger.merge(primary, secondary); // MdixMergeResult
let merged = result.unwrap(); // panics if a conflict was unresolved under ThrowOnConflict

// Or handle conflicts explicitly instead of unwrapping:
match result.into_result() {
    Ok((merged, conflicts)) => {
        for c in &conflicts { println!("resolved: {:?}", c); }
    }
    Err(msg) => eprintln!("merge failed: {msg}"),
}

// Any number of sources, left to right
let combined = merger.merge_all(vec![primary, secondary, tertiary]);

// Straight from files
let from_files = MdixMerger::new().merge_files(&["base.mdix", "overrides.mdix"])?;
let weighted   = MdixMerger::new().merge_files_weighted(&[("base.mdix", 1.0), ("local.mdix", 0.8)])?;

// Guarantees regardless of input ordering or strategy:
// - Tier-1 @DATA properties always precede tier-2 in the merged output.
// - AST-level merge — Long/Float/Double/ScientificNotation/EnumValue survive
//   exactly, unlike a JSON round-trip merge.
// - TableProperty / SecurityEntry / EnumDeclaration sharing a path/name are
//   deep-merged field-by-field rather than one replacing the other outright.`;
</script>

<div class="doc-page">
  <h1>MdixMerger — Combining Databases</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. AST-level merging — no
    JSON round-trip, so <code>Long</code>, <code>Float</code>, <code>Double</code>,
    <code>ScientificNotation</code>, and <code>EnumValue</code> all survive a
    merge exactly as-is. The two-tier <code>@DATA</code> ordering guarantee is
    enforced by construction in the merged output regardless of input order.
  </p>

  <CodeBlock code={mergeApi} lang="rust" />

  <h2>Merge Strategies</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Strategy</th><th>Behaviour</th></tr></thead>
      <tbody>
        {#each [
          { s: 'MdixMergeStrategy::WeightedPriority', d: 'Default. Each source carries a weight in [0.0, 1.0] — higher wins. Equal-weight ties fall back to primary (lower index) wins.' },
          { s: 'MdixMergeStrategy::PrimaryWins',       d: 'The source with the lower index always wins conflicts.' },
          { s: 'MdixMergeStrategy::SecondaryWins',      d: 'The source with the higher index always wins conflicts.' },
          { s: 'MdixMergeStrategy::ThrowOnConflict',    d: 'Any conflicting key returns Err instead of picking a winner.' },
          { s: 'ArrayMergeStrategy::ConcatDedup',       d: 'Default for GroupArray entries sharing a path. Winner\'s items first, exact-duplicate primitives removed.' },
          { s: 'ArrayMergeStrategy::Concat',            d: 'Concatenate everything, keep duplicates.' },
          { s: 'ArrayMergeStrategy::Replace',           d: 'Winner\'s array entirely replaces the loser\'s.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.s}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
