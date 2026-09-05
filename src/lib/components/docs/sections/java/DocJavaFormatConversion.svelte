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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'toJson(db, indented)',      d: 'Export as a JSON string.' },
          { m: 'toMdix(db, formatMode)',     d: 'Export as .mdix source text.' },
          { m: 'toToml(db)',                d: 'Export as a TOML string.' },
          { m: 'fromJson(json) / fromToml(toml)', d: 'Parse a foreign format string into a new Database.' },
          { m: 'formatSource(src, mode)',    d: 'Reformat raw .mdix source text.' },
          { m: 'minifySource(src)',          d: 'Aggressively shrink raw .mdix source text.' },
          { m: 'jsonRoundTrip(db)',          d: 'Export then re-import through JSON — a cheap way to deep-clone a Database.' },
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
