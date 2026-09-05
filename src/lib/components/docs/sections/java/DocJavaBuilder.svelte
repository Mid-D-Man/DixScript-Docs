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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new Builder()',                    d: 'Create a new, empty builder.' },
          { m: 'setString/Int/Long/Float/Double/Bool/Date/Timestamp(path, v)', d: 'Set a flat property — fluent, returns this.' },
          { m: 'hasKey(path)',                     d: 'True if a property is set at path.' },
          { m: 'remove(path)',                     d: 'Remove a previously-set property.' },
          { m: 'entryCount() / clear()',           d: 'Number of set properties / reset the builder to empty.' },
          { m: 'saveToFile(path)',                 d: 'Write the built source directly to a file.' },
          { m: 'toMdixString()',                   d: 'Produce the raw .mdix source string.' },
          { m: 'toDatabase()',                     d: 'Parse the built source into a Database.' },
          { m: 'close()',                          d: 'Free the native handle — Builder implements AutoCloseable.' },
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
