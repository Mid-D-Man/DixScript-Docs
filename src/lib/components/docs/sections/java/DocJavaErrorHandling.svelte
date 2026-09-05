<!-- src/lib/components/docs/sections/java/DocJavaErrorHandling.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const exceptionApi = `import com.midmanstudio.dixscript.MdixException;

try {
    int port = db.getInt("server.port");
} catch (MdixException e) {
    // getMessage() carries the underlying error text; there is currently
    // no separate ErrorKind enum on the Java side (unlike C#/Go/Python) —
    // if you need to branch on error category, parse getMessage() or
    // check exists()/valueTypeAt() defensively before the get*() call.
    log.error("dixscript read failed", e);
}

// Every getter has a two-argument default overload specifically so you
// can avoid try/catch for optional fields — prefer those over blanket
// try/catch where a sensible default exists.`;
</script>

<div class="doc-page">
  <h1>Error Handling</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={exceptionApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Pattern</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'db.getInt(path)',                d: 'Throws MdixException if path is missing or the wrong type.' },
          { m: 'db.getInt(path, default)',        d: 'Returns default instead of throwing — every typed getter has this overload.' },
          { m: 'e.getMessage()',                  d: 'The underlying error text — no separate ErrorKind enum to branch on here.' },
          { m: 'db.exists(path) / db.valueTypeAt(path)', d: 'Defensive checks before a get*() call, as an alternative to try/catch.' },
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
