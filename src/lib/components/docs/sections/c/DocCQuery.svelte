<!-- src/lib/components/docs/sections/c/DocCQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const queryC = `// Whole-segment "*" only — e.g. "levels.*.enemies" matches every
// "enemies" value across sibling "levels.N" paths that share that shape.
char* json = mdix_select_many_as_json(db, "levels.*.enemies");
// -> JSON array of every matched value, one entry per matching path
mdix_free_string(json);`;

  const queryCpp = `auto matches = db->query_many("levels.*.enemies"); // Result<std::string> — JSON array`;
</script>

<div class="doc-page">
  <h1>Query</h1>
  <p class="page-lead">Part of the <a href="#c-api">C / C++ Runtime API</a>.</p>

  <CodeBlock code={queryC} lang="c" />
  <CodeBlock code={queryCpp} lang="cpp" />

  <p>
    For a single value at one known, fixed path, <code>mdix_get_json()</code> /
    <code>db-&gt;get_json()</code> already covers it — <code>select_many_as_json</code>
    / <code>query_many</code> exist specifically for the wildcarded, multi-path
    case, gathered via the core Runtime's
    <code>dixscript::Runtime::DixData::select_many</code>.
  </p>
</div>
