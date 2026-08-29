<!-- src/lib/components/docs/sections/java/DocJavaQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const quickStart = `import com.midmanstudio.dixscript.DixScript;
import com.midmanstudio.dixscript.Database;

try (Database db = DixScript.load("config.mdix")) {
    int port     = db.getInt("server.port");
    String host  = db.getString("server.host", "localhost"); // overload w/ default
    boolean debug = db.getBool("debug", false);
} catch (MdixException e) {
    System.err.println("load failed: " + e.getMessage());
}`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={quickStart} lang="java" />
</div>
