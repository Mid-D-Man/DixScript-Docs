<!-- src/lib/components/docs/sections/python/DocPythonQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const queryApi = `# db.query(path) — None if path doesn't exist or isn't array-shaped
enemies = db.query("enemies")

boss = (enemies
        .where_(lambda e: e["hp"] > 100)
        .order_by_desc(lambda e: e["hp"])
        .first())

named = enemies.where_field_eq("name", "Goblin")   # shortcut for a common where_() case

names   = enemies.select(lambda e: e["name"])
total   = enemies.sum_int(lambda e: e["hp"])
avg_hp  = enemies.avg_float(lambda e: e["hp"])
grouped = enemies.group_by(lambda e: e["name"][0])

# query_many(pattern) — whole-segment glob across sibling paths,
# resolved natively (not a client-side loop)
statuses = db.query_many("servers.*.status")

# MdixQuery supports normal Python container protocols too:
len(enemies)
enemies[0]
bool(enemies)   # False if empty
list(enemies)   # same as .to_list()`;
</script>

<div class="doc-page">
  <h1>Query — LINQ-style Chaining</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>.
    <code>db.query(path)</code> starts an <code>MdixQuery</code> over an
    array value; <code>db.query_many(pattern)</code> does the same across
    a whole-segment glob like <code>"servers.*.status"</code>, resolved
    natively. Supports Python's container protocols directly —
    <code>len()</code>, indexing, <code>bool()</code>, iteration.
  </p>
  <CodeBlock code={queryApi} lang="python" />
</div>
