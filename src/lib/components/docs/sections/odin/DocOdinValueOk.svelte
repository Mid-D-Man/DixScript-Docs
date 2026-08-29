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
</div>
