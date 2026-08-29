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
</div>
