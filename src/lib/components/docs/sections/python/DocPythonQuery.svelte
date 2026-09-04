<!-- src/lib/components/docs/sections/python/DocPythonQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const exampleMdix = `@DATA(
  enemies:: { name = "Goblin", hp = 50 }, { name = "Orc", hp = 100 }, { name = "Troll", hp = 150 }
)`;

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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={queryApi} lang="python" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '.where_(pred) / .where_field_eq(field, value)', d: 'Filter — a predicate lambda, or a shortcut for a single-field equality check.' },
          { m: '.skip(n) / .take(n)',                 d: 'Slice the sequence.' },
          { m: '.distinct()',                          d: 'Remove duplicate elements.' },
          { m: '.order_by(key) / .order_by_desc(key)', d: 'Sort by a key function.' },
          { m: '.select(map)',                         d: 'Project each element through a function — returns a plain list.' },
          { m: '.group_by(key)',                       d: 'Returns a list of (key, [elements]) pairs.' },
          { m: '.any(pred) / .all(pred)',               d: 'True/False checks over the sequence.' },
          { m: '.count() / .is_empty',                  d: 'Element count / whether the sequence is empty (is_empty is a property).' },
          { m: '.first() / .first_or(default) / .last() / .nth(i)', d: 'Element access — first()/last() return None if empty.' },
          { m: '.sum_int(key) / .sum_float(key) / .avg_float(key)', d: 'Numeric aggregation over a key function.' },
          { m: '.min_by_key(key) / .max_by_key(key)',   d: 'Element with the min/max key value.' },
          { m: '.to_list()',                            d: 'Materialize as a plain Python list.' },
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
