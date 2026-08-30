<!-- src/lib/components/docs/sections/rust/DocRustMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const baseMdix = `// base.mdix
@DATA(
  app_name = "MyApp"
  port<int> = 8080

  server:
    host = "0.0.0.0"
    ssl  = true

  enemies:: "Goblin", "Orc"
)`;

  const overlayMdix = `// local.mdix — a developer's machine-specific overrides
@DATA(
  port<int> = 3000

  server:
    host = "127.0.0.1"

  enemies:: "Dragon"
)

// Merged with PrimaryWins(base.mdix, local.mdix): port stays 8080 (base
// wins conflicts), server.host stays "0.0.0.0". Flip the argument order
// (or use SecondaryWins) and local.mdix's values win instead.
// enemies becomes ["Goblin", "Orc", "Dragon"] under the default
// ArrayConcatDedup strategy regardless of which side "wins" scalars.`;

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

  <h2>Example — base config + local override</h2>
  <p>A typical shape: a checked-in base config and a gitignored local override merged on top of it at startup.</p>
  <CodeBlock code={baseMdix} lang="dixscript" />
  <CodeBlock code={overlayMdix} lang="dixscript" />

  <CodeBlock code={mergeApi} lang="rust" />

  <div class="tip-callout">
    <strong>Choosing a strategy</strong>
    <ul>
      <li><strong>Use <code>PrimaryWins</code>/<code>SecondaryWins</code></strong> for the base-config-plus-override pattern above — it's predictable and easy to reason about: whichever file you put first (or second) always wins, full stop.</li>
      <li><strong>Use <code>WeightedPriority</code></strong> when merging more than two sources with genuinely different trust levels — e.g. defaults (weight 0.1) &lt; environment config (weight 0.5) &lt; explicit CLI overrides (weight 1.0) — rather than a strict left-to-right chain.</li>
      <li><strong>Use <code>ThrowOnConflict</code></strong> when a conflict is a bug, not a feature — merging two peer configs that should never define the same key (e.g. two plugins contributing to the same namespace).</li>
      <li><strong>Avoid</strong> reaching for <code>MdixMerger</code> just to apply one or two overrides on top of a known base — that's what <a href="#rust-api--builder"><code>DixDataBuilder</code></a> or plain field assignment after loading is for. Merging is for combining two independently-authored <em>sources</em>, not patching a couple of fields at runtime.</li>
    </ul>
  </div>

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

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'MdixMerger::new()',                        d: 'Create a merger with default strategy (WeightedPriority) and array strategy (ConcatDedup).' },
          { m: '.with_strategy(strategy)',                 d: 'Set the conflict-resolution strategy for scalar/table conflicts.' },
          { m: '.with_array_strategy(strategy)',           d: 'Set the strategy for GroupArray entries sharing a path.' },
          { m: '.merge(primary, secondary)',               d: 'Merge exactly two MdixMergeInput values. Returns MdixMergeResult.' },
          { m: '.merge_all(vec![...])',                    d: 'Merge any number of inputs, left to right.' },
          { m: '.merge_files(&[paths])',                   d: 'Load and merge directly from file paths, equal weight.' },
          { m: '.merge_files_weighted(&[(path, weight)])', d: 'Load and merge from file paths with explicit weights.' },
          { m: 'MdixMergeInput::new(ast)',                 d: 'Wrap an AST as a merge input.' },
          { m: '.with_weight(f32) / .with_label(&str)',    d: 'Attach a weight (for WeightedPriority) and/or a debug label (shows up in conflict reports) to an input.' },
          { m: 'result.unwrap()',                          d: 'Get the merged AST, panicking on an unresolved ThrowOnConflict error.' },
          { m: 'result.into_result()',                     d: 'Convert to Result<(merged, Vec<conflict>), String> instead of panicking.' },
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
