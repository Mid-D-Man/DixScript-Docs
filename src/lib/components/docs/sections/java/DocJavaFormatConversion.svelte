<!-- src/lib/components/docs/sections/java/DocJavaFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const converterApi = `import com.midmanstudio.dixscript.Converter;

Converter c = DixScript.convert();

c.toJson(db, true);                          // indented JSON string
c.toMdix(db, FormatMode.DEFAULT);
c.toToml(db);

c.fromJson(jsonStr);                         // -> Database
c.fromToml(tomlStr);                         // -> Database

c.formatSource(source, FormatMode.DEFAULT);
c.minifySource(source);

c.jsonRoundTrip(db);   // db -> JSON -> db, useful for deep-cloning a Database`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={converterApi} lang="java" />
</div>
