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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Kotlin idiom</th><th>Java equivalent it replaces</th></tr></thead>
      <tbody>
        {#each [
          { m: '.use { db -> ... }',      d: 'try (Database db = ...) { ... } — Kotlin\u2019s AutoCloseable extension.' },
          { m: 'db.getInt("path")',        d: 'Same call as Java — no wrapper needed, works directly on the Java types.' },
          { m: 'db.getInt("path") ?: default', d: 'Elvis operator in place of the two-argument default overload, if you prefer nullable-style handling.' },
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
