<!-- src/lib/components/docs/sections/go/DocGoLoading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const loadApi = `db, err := dixscript.Load("config.mdix")           // from file
db, err := dixscript.LoadStr(src)                   // from string
db, err := dixscript.LoadEncrypted(enc, key)        // encrypted + key file
db, err := dixscript.LoadEncryptedPassword(enc, pw) // encrypted + password
db, err := dixscript.LoadJSON(jsonStr)              // from JSON
db, err := dixscript.LoadToml(tomlStr)              // from TOML
defer db.Close()`;
</script>

<div class="doc-page">
  <h1>Loading</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={loadApi} lang="go" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Function</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'dixscript.Load(path)',                        d: 'Load from a file path.' },
          { m: 'dixscript.LoadStr(source)',                    d: 'Load from an in-memory source string.' },
          { m: 'dixscript.LoadEncrypted(encPath, keyPath)',    d: 'Load an encrypted file, key from a separate key file.' },
          { m: 'dixscript.LoadEncryptedPassword(encPath, pw)', d: 'Load an encrypted file, key derived from a password.' },
          { m: 'dixscript.LoadEncryptedBytes(data, keyContent, pw)', d: 'Load encrypted data already in memory.' },
          { m: 'dixscript.LoadJSON(json) / LoadToml(toml)',    d: 'Load from a foreign format string.' },
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
