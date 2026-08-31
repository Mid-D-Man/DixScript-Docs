<!-- src/lib/components/docs/sections/csharp/DocCSharpMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const baseMdix = `// base.mdix
@DATA(
  app_name = "MyApp"
  port<int> = 8080

  server:
    host = "0.0.0.0"

  admins:: "alice", "bob"
)`;

  const overlayMdix = `// local.mdix
@DATA(
  port<int> = 3000

  server:
    host = "127.0.0.1"

  admins:: "carol"
)`;

  const mergeApi = `using MidManStudio.Mdix.Core;

using var baseDb    = Dix.Load("base.mdix").OrThrow();
using var overlayDb = Dix.Load("local.mdix").OrThrow();

// Merge returns MdixMergeOutcome, not MdixDatabase directly — it also
// carries every conflict that was resolved along the way.
MdixResult<MdixMergeOutcome> result = Dix.Merge(baseDb, overlayDb,
    MdixMergeStrategy.PrimaryWins,        // or SecondaryWins / WeightedPriority / ThrowOnConflict
    MdixArrayMergeStrategy.ConcatDedup);  // or Concat / Replace — default

using MdixMergeOutcome outcome = result.OrThrow();  // MdixMergeOutcome : IDisposable
MdixDatabase merged = outcome.Database;
// merged.GetInt("port") == 8080 — baseDb (primary) wins the scalar conflict
// merged.GetArray<string>("admins") == ["alice", "bob", "carol"] — arrays
// concat-dedup regardless of which side "won" the scalar conflicts

foreach (MdixMergeConflict c in outcome.Conflicts)
    Console.WriteLine($"{c.Path}: resolved via {c.WinningSource}");

// Any number, left to right
MdixResult<MdixMergeOutcome> combined = Dix.MergeAll(
    new[] { baseDb, envDb, localOverridesDb });

// Straight from raw .mdix source strings — no databases to load first
MdixResult<MdixMergeOutcome> fromSources = Dix.MergeSources(
    new[] { baseSource, overlaySource });

// Explicit per-source weights instead of positional auto-weighting
MdixResult<MdixMergeOutcome> weighted = Dix.MergeSourcesWeighted(
    new[] { (baseSource, 1.0), (overlaySource, 0.5) });

// Merge a raw JSON object into an existing database
MdixResult<MdixMergeOutcome> withJson = Dix.MergeJson(baseDb, jsonOverlayString);

// Async variants exist for all of the above, +Async, CancellationToken
var mergedAsync = await Dix.MergeAsync(baseDb, overlayDb, ct: ct);`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. AST-level
    merge — no JSON round-trip — calling straight into the same
    <code>dixscript::Runtime::MdixMerger</code> the Rust core itself uses.
  </p>

  <h2>Example — base config + local override</h2>
  <CodeBlock code={baseMdix} lang="dixscript" />
  <CodeBlock code={overlayMdix} lang="dixscript" />

  <CodeBlock code={mergeApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Choosing strategies, and outcome vs a bare database</strong>
    <ul>
      <li><strong>Merge returns <code>MdixMergeOutcome</code>, not <code>MdixDatabase</code> directly</strong> — remember to reach into <code>.Database</code> for the merged data, and <code>.Conflicts</code> if you want to know what got resolved and how. The outcome itself is <code>IDisposable</code> and disposing it disposes the database too.</li>
      <li><strong>Use <code>PrimaryWins</code>/<code>SecondaryWins</code></strong> for the base-plus-override shape above. <strong>Use <code>ThrowOnConflict</code></strong> when two sources should never define the same key at all — a real conflict there is a bug, not something to silently resolve.</li>
      <li><strong>The array strategy is separate from the scalar strategy</strong> — <code>ConcatDedup</code> (the default) combines group arrays like <code>admins</code> above regardless of which side "won" the scalar conflicts. Use <code>Replace</code> if you specifically want the winning source's array to fully replace the other's instead.</li>
      <li><strong>Use <code>MergeSources</code>/<code>MergeSourcesWeighted</code></strong> when you have raw <code>.mdix</code> text and don't need a loaded <code>MdixDatabase</code> for anything else — skips a load step neither <code>Merge</code> nor <code>MergeAll</code> can skip, since those require already-loaded databases as input.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'Dix.Merge(a, b, strategy?, arrayStrategy?)',      d: 'Merge exactly two loaded databases.' },
          { m: 'Dix.MergeAll(dbs, strategy?, arrayStrategy?)',    d: 'Merge any number of loaded databases, left to right.' },
          { m: 'Dix.MergeSources(sources, strategy?, arrayStrategy?)', d: 'Merge raw .mdix source strings directly, auto-weighted by position.' },
          { m: 'Dix.MergeSourcesWeighted(sources, strategy?, arrayStrategy?)', d: 'Same, with explicit (source, weight) pairs.' },
          { m: 'Dix.MergeJson(db, jsonString)',                   d: 'Merge a raw JSON object into a database.' },
          { m: 'Dix.MergeAsync / MergeAllAsync',                  d: 'Async twins, take a CancellationToken.' },
          { m: 'outcome.Database',                                 d: 'The merged MdixDatabase.' },
          { m: 'outcome.Conflicts',                                d: 'IReadOnlyList<MdixMergeConflict> — every key conflict that was resolved.' },
          { m: 'MdixMergeStrategy.WeightedPriority',              d: 'Default. Weight decides the winner; auto-assigned by position if not given explicitly.' },
          { m: 'MdixMergeStrategy.PrimaryWins / SecondaryWins',   d: 'Lower- or higher-indexed source always wins.' },
          { m: 'MdixMergeStrategy.ThrowOnConflict',               d: 'Any conflicting key fails the whole merge instead of picking a winner.' },
          { m: 'MdixArrayMergeStrategy.ConcatDedup',              d: 'Default. Combine arrays, drop exact-duplicate primitives.' },
          { m: 'MdixArrayMergeStrategy.Concat / Replace',         d: 'Combine keeping duplicates, or winning source fully replaces the other.' },
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
