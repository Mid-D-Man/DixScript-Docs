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

  <div class="table-scroll">
    <table>
      <thead><tr><th>C</th><th>C++</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { c: 'mdix_select_many_as_json(db, pattern)', cpp: 'db->query_many(pattern)', d: 'Whole-segment "*" wildcard across sibling paths, returned as a JSON array string.' },
          { c: 'mdix_get_json(db, path)',                cpp: 'db->get_json(path)',      d: 'Single fixed path — use this instead when there is no wildcard.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.c}</code></td>
            <td><code style="font-size:0.75rem">{row.cpp}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
