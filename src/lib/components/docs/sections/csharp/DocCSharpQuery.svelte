<!-- src/lib/components/docs/sections/csharp/DocCSharpQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  enemies::
    { name = "Goblin", hp<int> = 50  },
    { name = "Orc",    hp<int> = 100 },
    { name = "Dragon", hp<int> = 500 },
    { name = "Boss",   hp<int> = 999 }
)`;

  const queryApi = `using MidManStudio.Mdix.Core;

public class Enemy
{
    public string Name { get; set; } = "";
    public int Hp { get; set; }
}

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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={queryApi} lang="csharp" />

  <div class="tip-callout">
    <strong>MdixQuery vs plain LINQ</strong>
    <ul>
      <li><strong>Use these extensions</strong> for a one-shot filter/project/aggregate over data straight from the database — <code>QueryWhere</code> + <code>QuerySelect</code> reads cleaner than <code>GetArray&lt;T&gt;(path).SuccessResult.Where(...).Select(...)</code>, and every step still returns <code>MdixResult</code> so a missing/malformed path fails the same way any other read does.</li>
      <li><strong>Use <code>GetArray&lt;T&gt;(path)</code> + real LINQ</strong> once you're chaining more than two or three operations, or mixing in logic that has nothing to do with DixScript at all — at that point you're just writing LINQ, and the <code>Query*</code> prefix stops adding anything.</li>
      <li><strong>Avoid <code>QuerySingle</code> unless "exactly one match" is a real invariant of the data</strong> — reach for <code>QueryFirst</code> with a predicate instead if more than one match is a legitimate, non-error possibility; <code>QuerySingle</code> fails on zero <em>or</em> more than one, on purpose.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'QueryFirst<T>(path, predicate?)',       d: 'First match, or the first element if no predicate. Fails if the array is empty (or nothing matches).' },
          { m: 'QueryLast<T>(path, predicate?)',        d: 'Same, from the end.' },
          { m: 'QuerySingle<T>(path, predicate)',       d: 'Exactly one match required — fails on zero or more than one.' },
          { m: 'QueryWhere<T>(path, predicate)',        d: 'All matching elements, as a List<T>.' },
          { m: 'QuerySelect<T, TResult>(path, selector)', d: 'Project each element to a different type/shape.' },
          { m: 'QueryCount<T>(path, predicate?)',       d: 'Count of all elements, or of matches if a predicate is given.' },
          { m: 'QueryAny<T>(path, predicate)',          d: 'True if at least one element matches.' },
          { m: 'QueryAll<T>(path, predicate)',          d: 'True if every element matches.' },
          { m: 'QueryOrderBy/OrderByDescending<T, TKey>(path, keySelector)', d: 'Sorted copy of the array.' },
          { m: 'QueryDistinct<T>(path)',                d: 'Unique values only, order preserved.' },
          { m: 'QueryTake<T>(path, n) / QuerySkip<T>(path, n)', d: 'First/all-but-first n elements.' },
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
