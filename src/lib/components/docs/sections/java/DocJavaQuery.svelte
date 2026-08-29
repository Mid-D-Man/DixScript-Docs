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
</div>
