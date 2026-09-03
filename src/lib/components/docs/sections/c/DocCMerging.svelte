<!-- src/lib/components/docs/sections/c/DocCMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const mergeC = `const char* sources[] = { primary_src, secondary_src };
char* conflicts_json = NULL;   // pass NULL here to skip the report entirely

void* merged = mdix_merge_sources(
    sources, 2,
    MDIX_MERGE_WEIGHTED_PRIORITY,   // conflict-resolution strategy
    MDIX_ARRAY_MERGE_CONCAT_DEDUP,  // how array-valued entries combine
    &conflicts_json);

if (!merged) {
    fprintf(stderr, "merge failed: %s\\n", mdix_get_last_error());
} else {
    // conflicts_json: "[]" if nothing overlapped, else a JSON array of
    // { path, winningSource, winningLabel } — one entry per contested key
    mdix_free_string(conflicts_json);
    mdix_free(merged);
}

// Explicit per-source weights instead of the default descending 1.0 -> 0.0:
double weights[] = { 0.8, 0.2 };
void* merged2 = mdix_merge_sources_weighted(
    sources, weights, 2,
    MDIX_MERGE_PRIMARY_WINS, MDIX_ARRAY_MERGE_REPLACE, NULL);`;

  const mergeCpp = `auto result = mdix::merge_sources(
    { primary_src, secondary_src },
    MDIX_MERGE_WEIGHTED_PRIORITY,
    MDIX_ARRAY_MERGE_CONCAT_DEDUP);

if (!result) {
    std::cerr << result.error().message() << '\\n';
} else if (result->has_conflicts()) {
    for (const auto& c : result->conflicts)
        std::cout << c.path << " -> source " << c.winning_source
                   << " (" << c.winning_label << ")\\n";
}
// result->database is a full mdix::Database, freed automatically`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. Real AST-level merge
    — weighted-priority conflict resolution, per-source conflict reporting,
    full type fidelity — not a shallow JSON-object merge.
  </p>

  <CodeBlock code={mergeC} lang="c" />
  <CodeBlock code={mergeCpp} lang="cpp" />

  <h2>MdixMergeStrategy — how a contested key resolves</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Value</th><th>Behavior</th></tr></thead>
      <tbody>
        <tr><td><code>WEIGHTED_PRIORITY</code></td><td>Each source's weight decides the winner; equal weights fall back to the lower-indexed (primary) source. What <code>mdix_merge_sources()</code> (no explicit weights) resolves to — it auto-assigns descending weights, source 0 gets 1.0, the last source ~0.0.</td></tr>
        <tr><td><code>PRIMARY_WINS</code></td><td>The lower-indexed source always wins, regardless of weight.</td></tr>
        <tr><td><code>SECONDARY_WINS</code></td><td>The higher-indexed source always wins, regardless of weight.</td></tr>
        <tr><td><code>THROW_ON_CONFLICT</code></td><td>Any key defined by more than one source is a hard error — the whole merge fails (<code>NULL</code> / a failed <code>Result</code>), not a partial result.</td></tr>
      </tbody>
    </table>
  </div>

  <h2>MdixArrayMergeStrategy — how array values combine</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Value</th><th>Behavior</th></tr></thead>
      <tbody>
        <tr><td><code>REPLACE</code></td><td>The winning source's array entirely replaces the losing one's.</td></tr>
        <tr><td><code>CONCAT</code></td><td>Both arrays concatenated, winner's items first.</td></tr>
        <tr><td><code>CONCAT_DEDUP</code></td><td>Concatenated (winner first), exact-duplicate primitive values removed. Complex values (objects, nested arrays) are never deduped.</td></tr>
      </tbody>
    </table>
  </div>

  <div class="tip-callout">
    <strong>Conflict reporting</strong>
    <ul>
      <li>In C, pass <code>NULL</code> for <code>out_conflicts_json</code> if you don't need the report — it's skipped, not an error.</li>
      <li>In C++, <code>MergeConflict.winning_label</code> is parsed out of the raw conflicts JSON by a small hand-rolled scanner in <code>mdix.hpp</code> (documented in source as deliberately not a general JSON parser — kept dependency-free rather than pulling in a JSON library for one small task).</li>
      <li><code>THROW_ON_CONFLICT</code> hitting a real conflict looks identical to any other merge failure from the return value alone — check <code>mdix_get_last_error()</code> / <code>result.error()</code> for the actual reason.</li>
    </ul>
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
