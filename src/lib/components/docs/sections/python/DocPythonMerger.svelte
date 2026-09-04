<!-- src/lib/components/docs/sections/python/DocPythonMerger.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const mergerApi = `from midmanstudio.mdix import MdixMerger

# Merge multiple .mdix sources with weighted or strict conflict resolution
db = (MdixMerger()
      .with_strategy("primary_wins")        # or "secondary_wins", etc.
      .with_array_strategy("concat")        # array-specific merge strategy
      .merge_strings([
          ("base",    '@DATA( name = "App", port = 8080 )', 1.0),
          ("overlay", '@DATA( name = "Override", debug = true )', 0.5),
      ]))

# From files instead of strings
db2 = MdixMerger().merge_files(["base.mdix", "overrides.mdix"])
db3 = MdixMerger().merge_files_weighted([("base.mdix", 1.0), ("local.mdix", 0.8)])

# Railway variants
result  = MdixMerger().try_merge_files(["base.mdix", "overrides.mdix"])
result2 = MdixMerger().try_merge_files_weighted([("base.mdix", 1.0)])`;

  const mergeWithApi = `# Merging two already-loaded databases directly, without MdixMerger
merged, conflicts = db1.merge_with(
    db2,
    strategy="weighted_priority",       # optional — defaults same as MdixMerger
    array_strategy="concat_dedup",
    temp_dir=None,                      # override the temp-file location if needed
)
# db1 wins ties (first argument = higher priority), matching merge_files semantics`;
</script>

<div class="doc-page">
  <h1>MdixMerger — Combining Sources</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>. Real AST-level
    merge, same engine every other binding uses — but with one significant
    binding-specific limitation, below.
  </p>

  <CodeBlock code={mergerApi} lang="python" />

  <h2>MdixDatabase.merge_with()</h2>
  <p>
    A second entry point, on <code>MdixDatabase</code> itself rather than
    <code>MdixMerger</code> — for merging two databases you already have
    loaded, without re-reading from files or strings.
  </p>
  <CodeBlock code={mergeWithApi} lang="python" />

  <div class="tip-callout">
    <strong>Conflict reporting doesn't actually work anywhere in this binding</strong>
    <ul>
      <li><strong><code>MdixMerger.merge_files</code>/<code>merge_files_weighted</code>/<code>merge_strings</code> return only the merged <code>MdixDatabase</code></strong> — no conflicts value at all, not even an empty one. Checked directly against every method signature in <code>merge.rs</code>.</li>
      <li><strong><code>merge_with()</code>'s <code>conflicts</code> is always an empty list</strong> — documented directly in its own source comment as a known, real gap. It goes through a source-text round trip that only has access to the core's simpler file-merge path, which doesn't produce per-field conflict detail (that detail exists in the core crate, but only via an AST-input path this binding doesn't use). The merge result itself is correct; you just never find out what it resolved.</li>
      <li><strong><code>merge_strings()</code>'s <code>label</code> in each <code>(label, source, weight)</code> tuple is accepted and silently discarded</strong> — the source comment says it exists for "conflict-report readability," but since nothing here produces a conflict report, it currently has no effect at all. Pass anything; it's read but never used.</li>
    </ul>
    If you need to know which keys actually conflicted, none of the Python
    entry points can currently tell you — every other binding (C#, Go, Java,
    PHP, C/C++) returns real per-key conflict detail.
  </div>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Strategy string</th><th>Behavior</th></tr></thead>
      <tbody>
        {#each [
          { m: '"weighted_priority" (default)', d: 'Each source\'s weight decides the winner; ties favor the lower-indexed source.' },
          { m: '"primary_wins"',   d: 'The lower-indexed source always wins, regardless of weight.' },
          { m: '"secondary_wins"', d: 'The higher-indexed source always wins, regardless of weight.' },
          { m: '"throw_on_conflict"', d: 'Any key defined by more than one source fails the whole merge.' },
          { m: '"replace" (array_strategy)',      d: 'The winning source\'s array entirely replaces the losing array.' },
          { m: '"concat" (array_strategy)',        d: 'Both arrays concatenated, winning source\'s items first.' },
          { m: '"concat_dedup" (array_strategy, default)', d: 'Concatenated, exact-duplicate primitive values removed.' },
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
