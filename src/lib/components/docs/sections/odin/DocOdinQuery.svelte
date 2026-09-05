<!-- src/lib/components/docs/sections/odin/DocOdinQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const queryApi = `import "mdix"

Enemy :: struct { name: string, hp: int }

// query_load reads an array at path straight into a typed Query(T)
q, ok := mdix.query_load(Enemy, db, "enemies")
defer mdix.query_delete(q)

boss, found := mdix.query_first(
    mdix.query_order_by_desc(
        mdix.query_where(q, proc(e: Enemy) -> bool { return e.hp > 100 }),
        proc(e: Enemy) -> int { return e.hp },
    ),
)

names := mdix.query_select(q, proc(e: Enemy) -> string { return e.name })
total := mdix.query_sum_int(q, proc(e: Enemy) -> i64 { return i64(e.hp) })
avg, has_avg := mdix.query_avg_float(q, proc(e: Enemy) -> f64 { return f64(e.hp) })
groups := mdix.query_group_by(q, proc(e: Enemy) -> rune { return rune(e.name[0]) })

// query_many gathers every sibling path matched by a whole-segment glob
// ("*" only) directly — no Query(T) wrapper, just the resulting slice
all_statuses, ok2 := mdix.query_many(string, db, "servers.*.status")`;
</script>

<div class="doc-page">
  <h1>Query — Typed, Chainable</h1>
  <p class="page-lead">
    Part of the <a href="#odin-api">Odin Runtime API</a>.
    <code>query_load(T, db, path)</code> reads an array straight into a
    typed <code>Query(T)</code>; <code>query_many(T, db, pattern)</code>
    gathers every sibling path matched by a whole-segment glob directly
    into a slice, no <code>Query(T)</code> wrapper needed.
  </p>
  <CodeBlock code={queryApi} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'query_load(T, db, path) / query_new(slice)', d: 'Read an array at path into a typed Query(T), or wrap a slice you already have.' },
          { m: 'query_delete(q)',                  d: 'Free the query.' },
          { m: 'query_where(q, pred) / query_skip(q, n) / query_take(q, n)', d: 'Chainable filtering and slicing.' },
          { m: 'query_order_by(q, key) / query_order_by_desc(q, key) / query_distinct(q)', d: 'Chainable sorting and deduplication.' },
          { m: 'query_any(q, pred) / query_all(q, pred) / query_count(q) / query_is_empty(q)', d: 'Boolean and count checks.' },
          { m: 'query_first(q) / query_first_or(q, default) / query_last(q) / query_nth(q, i)', d: 'Element access, each returning (value, ok).' },
          { m: 'query_select(q, map) / query_group_by(q, key)', d: 'Project to a new type, or group into a map.' },
          { m: 'query_sum_int(q, key) / query_sum_float(q, key) / query_avg_float(q, key)', d: 'Numeric aggregation over a key function.' },
          { m: 'query_min_by_key(q, key) / query_max_by_key(q, key)', d: 'Element with the min/max key value.' },
          { m: 'query_many(T, db, pattern)',        d: 'Whole-segment wildcard match, gathered directly into a slice.' },
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
