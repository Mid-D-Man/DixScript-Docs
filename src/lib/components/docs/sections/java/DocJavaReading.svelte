<!-- src/lib/components/docs/sections/java/DocJavaReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `db.exists("server.host");                 // boolean
db.valueTypeAt("server.port");            // ValueType enum
db.arrayLength("enemies");                // int
db.keys("server");                        // List<String> — direct children
db.keys();                                // List<String> — top-level keys

db.getString("server.host");              // throws MdixException if missing
db.getString("server.host", "localhost"); // overload — returns default instead

db.getInt("server.port");
db.getInt("server.port", 8080);
db.getLong("session_id");
db.getLong("session_id", 0L);
db.getFloat("ratio");
db.getFloat("ratio", 1.0f);
db.getDouble("pi");
db.getDouble("pi", 0.0);
db.getBool("debug");
db.getBool("debug", false);

db.getEnumName("log_level");   // "LogLevel"
db.getEnumField("log_level");  // "INFO"
db.getEnumValue("log_level");  // resolved int

db.getJson("server");          // raw JSON string of a nested object/array`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java / Kotlin Runtime API</a>. Every
    typed getter has two overloads: a strict form that throws
    <code>MdixException</code> if the path is missing or the wrong type,
    and a form that takes a default value instead.
  </p>
  <CodeBlock code={readApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'exists(path)',                    d: 'True if a value exists at path.' },
          { m: 'valueTypeAt(path)',                d: 'The stored type as a ValueType enum.' },
          { m: 'arrayLength(path)',                d: 'Number of elements at an array path.' },
          { m: 'keys(prefix) / keys()',            d: 'Direct child keys under prefix, or top-level keys.' },
          { m: 'getString/getInt/getLong/getFloat/getDouble/getBool(path[, default])', d: 'Typed getters, each with a throwing and a default-value overload.' },
          { m: 'getEnumName/getEnumField/getEnumValue(path)', d: 'Enum type name / field name / resolved integer value.' },
          { m: 'getJson(path)',                    d: 'Raw JSON string of a nested object/array at path.' },
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
