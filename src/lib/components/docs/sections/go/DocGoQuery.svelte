<!-- src/lib/components/docs/sections/go/DocGoQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const queryApi = `type Enemy struct {
    Name string \`json:"name"\`
    HP   int    \`json:"hp"\`
}

// LoadQuery reads a group array at path straight into a *Query[T]
enemies, err := dixscript.LoadQuery[Enemy](db, "enemies")

// Or wrap a slice you already have
q := dixscript.NewQuery(myEnemies)

// Chainable, lazy until a terminal call
boss, ok := enemies.
    Where(func(e Enemy) bool { return e.HP > 100 }).
    OrderByDesc(func(e Enemy) int { return e.HP })).
    First()

names := dixscript.Select(enemies, func(e Enemy) string { return e.Name })
total := dixscript.SumInt(enemies, func(e Enemy) int64 { return int64(e.HP) })
avg, ok := dixscript.AvgFloat(enemies, func(e Enemy) float64 { return float64(e.HP) })
groups := dixscript.GroupBy(enemies, func(e Enemy) string { return e.Name[:1] })

// Or skip Query[T] entirely for a one-shot decode
var raw []Enemy
jsonStr, err := db.QueryManyJSON("enemies.*")
json.Unmarshal([]byte(jsonStr), &raw)`;
</script>

<div class="doc-page">
  <h1>Query — LINQ-style Helpers</h1>
  <p class="page-lead">
    Part of the <a href="#go-api">Go Runtime API</a>.
    <code>Query[T]</code> and its generic free functions (<code>Select</code>,
    <code>OrderBy</code>, <code>GroupBy</code>, <code>SumInt</code>,
    <code>AvgFloat</code>, ...) give you filtering/projection/aggregation
    over a group array without hand-decoding JSON.
  </p>
  <CodeBlock code={queryApi} lang="go" />
</div>
