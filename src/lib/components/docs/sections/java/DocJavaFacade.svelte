<!-- src/lib/components/docs/sections/java/DocJavaFacade.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const facadeApi = `import com.midmanstudio.dixscript.DixScript;

DixScript.version();                              // -> String
DixScript.load(String path);                       // -> Database, throws MdixException
DixScript.loadStr(String source);                   // -> Database
DixScript.loadEncrypted(String encPath, String keyPath);         // -> Database
DixScript.loadEncryptedPassword(String encPath, String password); // -> Database
DixScript.loadJson(String json);                    // -> Database
DixScript.loadToml(String toml);                    // -> Database
DixScript.newBuilder();                             // -> Builder
DixScript.convert();                                // -> Converter`;
</script>

<div class="doc-page">
  <h1>DixScript Facade</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={facadeApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'version()',                              d: 'The Runtime crate version string.' },
          { m: 'load(path) / loadStr(source)',             d: 'Load from a file path or an in-memory source string.' },
          { m: 'loadEncrypted(encPath, keyPath)',          d: 'Load an encrypted file, key from a separate key file.' },
          { m: 'loadEncryptedPassword(encPath, password)', d: 'Load an encrypted file, key derived from a password.' },
          { m: 'loadJson(json) / loadToml(toml)',          d: 'Load from a foreign format string.' },
          { m: 'newBuilder()',                             d: 'Start a new Builder.' },
          { m: 'convert()',                                d: 'Get a Converter for export/import/format-transform operations.' },
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
