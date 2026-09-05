<!-- src/lib/components/docs/sections/odin/DocOdinValueOk.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const valueOkPattern = `// Every read follows Odin's (value, ok) convention — no exceptions,
// no null-sentinel + separate error check like the raw C API.
port, ok := mdix.get_int(db, "server.port")
if !ok {
    fmt.println("read failed:", mdix.last_error())
}

// String-returning procs take an optional allocator (defaults to
// context.allocator) and the result is caller-owned — delete() it:
host, ok := mdix.get_string(db, "server.host", allocator = context.allocator)
defer delete(host)

// Values going IN (path/value arguments) are converted via
// context.temp_allocator. In long-running loops with no surrounding
// temp scope, call free_all(context.temp_allocator) yourself.
mdix.last_error()    // string — most recent error message
mdix.clear_error()   // clear it explicitly`;
</script>

<div class="doc-page">
  <h1>The (value, ok) Pattern</h1>
  <p class="page-lead">
    Part of the <a href="#odin-api">Odin Runtime API</a>. No exceptions,
    no hidden allocation. String-returning procedures take an optional
    <code>allocator</code> parameter and hand back a caller-owned string —
    you <code>delete()</code> it. Values passed in go through
    <code>context.temp_allocator</code>.
  </p>
  <CodeBlock code={valueOkPattern} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Convention</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '(value, ok) return',        d: 'Every fallible procedure returns this pair instead of throwing or using a sentinel.' },
          { m: 'last_error()',               d: 'The most recent error message as a string, for when ok is false.' },
          { m: 'clear_error()',              d: 'Clear the stored error explicitly, so a stale message is not read by mistake.' },
          { m: 'allocator = context.allocator', d: 'Optional parameter on string-returning procedures — the returned string is caller-owned, delete() it.' },
          { m: 'context.temp_allocator',      d: 'Used internally for values passed in — call free_all(context.temp_allocator) yourself in long-running loops with no surrounding temp scope.' },
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
