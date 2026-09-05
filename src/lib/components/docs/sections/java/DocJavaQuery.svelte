<!-- src/lib/components/docs/sections/java/DocJavaQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const queryApi = `// query(path) — chainable LINQ-style helpers over a single array value
MdixQuery enemies = db.query("enemies");

MdixValue boss = enemies
    .where_(e -> e.field("hp").asInt() > 100)
    .orderByDescending(e -> e.field("hp").asInt())
    .first();

List<String> names = enemies.select(e -> e.field("name").asString());
long totalHp        = enemies.sumInt(); // sums the query's own numeric values, not a field
Map<Object, List<MdixValue>> byFirstLetter =
    enemies.groupBy(e -> e.field("name").asString().substring(0, 1));

// queryMany(pattern) — whole-segment glob across sibling paths,
// native select_many under the hood (not a client-side loop)
MdixQuery allEnemies = db.queryMany("levels.*.enemies");

// where_ has a trailing underscore — "where" isn't reserved in Java,
// but the API keeps it for readability alongside Kotlin/Scala usage.
MdixQuery cheap = db.query("items").whereFieldEquals("rarity", MdixValue.of("common"));`;
</script>

<div class="doc-page">
  <h1>Query — Chainable Helpers</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.
    <code>db.query(path)</code> starts an <code>MdixQuery</code> over an
    array value; <code>db.queryMany(pattern)</code> does the same across a
    whole-segment glob like <code>"levels.*.enemies"</code>, resolved
    natively rather than looped client-side.
  </p>
  <CodeBlock code={queryApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'where_(pred) / whereFieldEquals(field, value)', d: 'Filter — a predicate lambda, or a shortcut for a single-field equality check.' },
          { m: 'skip(n) / take(n) / distinct()',    d: 'Slice and deduplicate the sequence.' },
          { m: 'select(map) / selectField(field)',   d: 'Project each element through a function, or pull one field out directly.' },
          { m: 'orderBy(key) / orderByDescending(key)', d: 'Sort by a key function.' },
          { m: 'groupBy(key)',                        d: 'Returns a Map<Object, List<MdixValue>>.' },
          { m: 'any(pred) / all(pred) / count() / isEmpty()', d: 'Boolean and count checks over the sequence.' },
          { m: 'first() / firstOr(default) / last() / nth(i)', d: 'Element access.' },
          { m: 'sumInt() / sumFloat() / avgFloat()',  d: 'Numeric aggregation over the query\u2019s own values.' },
          { m: 'minByKey(key) / maxByKey(key)',       d: 'Element with the min/max key value.' },
          { m: 'toList() / stream()',                  d: 'Materialize as a List, or as a Java Stream.' },
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
