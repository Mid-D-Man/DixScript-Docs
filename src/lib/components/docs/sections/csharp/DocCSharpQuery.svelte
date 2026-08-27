<!-- src/lib/components/docs/sections/csharp/DocCSharpQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const queryApi = `using MidManStudio.Mdix.Core;

// LINQ-style extension methods over a loaded MdixDatabase — for querying
// group arrays without writing GetArray<T>() + manual LINQ every time.

db.QueryFirst<Enemy>("enemies");
db.QueryFirst<Enemy>("enemies", e => e.Hp > 100);
db.QueryLast<Enemy>("enemies");
db.QuerySingle<Enemy>("enemies", e => e.Name == "Boss");   // errors if 0 or >1 match

db.QueryWhere<Enemy>("enemies", e => e.Hp > 50);
db.QuerySelect<Enemy, string>("enemies", e => e.Name);

db.QueryCount<Enemy>("enemies");
db.QueryAny<Enemy>("enemies", e => e.Hp > 400);
db.QueryAll<Enemy>("enemies", e => e.Hp > 0);

db.QueryOrderBy<Enemy, int>("enemies", e => e.Hp);
db.QueryOrderByDescending<Enemy, int>("enemies", e => e.Hp);
db.QueryDistinct<string>("tags");

db.QueryTake<Enemy>("enemies", 3);
db.QuerySkip<Enemy>("enemies", 3);

// Every Query* method returns MdixResult<T> / MdixResult<List<T>> —
// same error-handling story as the rest of the API.`;
</script>

<div class="doc-page">
  <h1>Query — LINQ Over Group Arrays</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
    <code>MdixQuery</code> extension methods let you filter, project, and
    aggregate a group array at a path without hand-rolling
    <code>GetArray&lt;T&gt;(path)</code> + LINQ every time.
  </p>
  <CodeBlock code={queryApi} lang="csharp" />
</div>
