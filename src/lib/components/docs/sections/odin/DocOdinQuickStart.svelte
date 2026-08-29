<!-- src/lib/components/docs/sections/odin/DocOdinQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const quickStart = `import "mdix"
import "core:fmt"

main :: proc() {
    db, ok := mdix.load_str(\`@DATA( port = 8080, host = "localhost" )\`)
    if !ok {
        fmt.println("load failed:", mdix.last_error())
        return
    }
    defer mdix.destroy(&db)

    port, _ := mdix.get_int(db, "port")
    host, _ := mdix.get_string(db, "host")
    defer delete(host)   // string-returning procs are caller-owned

    fmt.println(host, port)
}`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={quickStart} lang="odin" />
</div>
