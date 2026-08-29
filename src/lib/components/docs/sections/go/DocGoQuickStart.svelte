<!-- src/lib/components/docs/sections/go/DocGoQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const quickStart = `import dixscript "github.com/Mid-D-Man/dixscript-go"

db, err := dixscript.Load("config.mdix")
if err != nil {
    log.Fatal(err)
}
defer db.Close()

port, _  := db.GetInt("server.port")
host, _  := db.GetString("server.host")
debug, _ := db.GetBool("debug")`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={quickStart} lang="go" />
</div>
