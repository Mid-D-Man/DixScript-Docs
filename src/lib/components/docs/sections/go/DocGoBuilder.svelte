<!-- src/lib/components/docs/sections/go/DocGoBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `b := dixscript.NewBuilder()
defer b.Close()

b.SetString("profile.name", "player1")
b.SetInt("profile.level", 42)
b.SetFloat64("profile.score", 9876.5)
b.SetBool("profile.active", true)
b.SetDate("profile.joined", time.Now())

err := b.SaveToFile("profile.mdix")

// Or get it as a string
src, err := b.ToString()

// Or load it directly
db, err := b.ToDatabase()
defer db.Close()`;
</script>

<div class="doc-page">
  <h1>Builder API</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={builderApi} lang="go" />
</div>
