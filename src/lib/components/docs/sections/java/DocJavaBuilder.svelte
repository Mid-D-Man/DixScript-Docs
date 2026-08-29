<!-- src/lib/components/docs/sections/java/DocJavaBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `import com.midmanstudio.dixscript.Builder;
import com.midmanstudio.dixscript.Database;

Builder b = new Builder();

b.setString("profile.name", "player1")
 .setInt("profile.level", 42)
 .setLong("profile.xp", 9_000_000_000L)
 .setFloat("profile.ratio", 0.75f)
 .setDouble("profile.score", 9876.5)
 .setBool("profile.active", true)
 .setDate("profile.joined", LocalDate.now())
 .setTimestamp("profile.created", Instant.now());

b.hasKey("profile.name");    // boolean
b.remove("profile.name");    // boolean
b.entryCount();               // int
b.clear();                    // reset the builder

b.saveToFile("profile.mdix");        // throws MdixException
String src = b.toMdixString();
Database db = b.toDatabase();
b.close();                            // Builder implements AutoCloseable`;
</script>

<div class="doc-page">
  <h1>Builder API</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={builderApi} lang="java" />
</div>
