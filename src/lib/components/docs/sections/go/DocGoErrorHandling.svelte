<!-- src/lib/components/docs/sections/go/DocGoErrorHandling.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const errorApi = `port, err := db.GetInt("server.port")
if err != nil {
    var me *dixscript.MdixError
    if errors.As(err, &me) {
        switch me.Kind {
        case dixscript.ErrNotFound:
            // path doesn't exist
        case dixscript.ErrTypeMismatch:
            // wrong type at path
        case dixscript.ErrClosed:
            // database was already closed
        }
    }
}`;
</script>

<div class="doc-page">
  <h1>Error Handling</h1>
  <p class="page-lead">
    Part of the <a href="#go-api">Go Runtime API</a>. Every function
    returns an idiomatic <code>(value, error)</code> pair. The error type
    is <code>*MdixError</code> — use <code>errors.As</code> to inspect its
    <code>Kind</code>.
  </p>
  <CodeBlock code={errorApi} lang="go" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Error Kind</th><th>Meaning</th></tr></thead>
      <tbody>
        {#each [
          { k: 'dixscript.ErrNotFound',     d: 'The requested path does not exist.' },
          { k: 'dixscript.ErrTypeMismatch', d: 'The value at the path cannot be converted to the requested type.' },
          { k: 'dixscript.ErrClosed',       d: 'The database/builder handle was already closed.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.k}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
