<!-- src/lib/components/docs/sections/java/DocJavaKotlin.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const kotlinExample = `DixScript.load("config.mdix").use { db ->
    val port = db.getInt("server.port")
}`;
</script>

<div class="doc-page">
  <h1>Kotlin</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java / Kotlin Runtime API</a>. No
    separate Kotlin package — the Java API is used as-is. Kotlin's
    <code>.use &#123; &#125;</code> extension on <code>AutoCloseable</code> works
    directly in place of try-with-resources:
  </p>
  <CodeBlock code={kotlinExample} lang="kotlin" />
</div>
