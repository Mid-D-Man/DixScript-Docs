<!-- src/lib/components/docs/sections/odin/DocOdinLoading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const loadApi = `db, ok := mdix.load(path)
db, ok := mdix.load_str(source)
db, ok := mdix.load_encrypted(enc_path, key_path = "")
db, ok := mdix.load_encrypted_password(enc_path, password)
db, ok := mdix.load_encrypted_bytes(bytes, key_content, password = "")
db, ok := mdix.from_json(json_source)
db, ok := mdix.from_toml(toml_source)
defer mdix.destroy(&db)

mdix.is_valid(db)      // bool
mdix.validate(source)  // bool — parse/validate without keeping a handle
mdix.version()         // string — runtime version`;
</script>

<div class="doc-page">
  <h1>Loading</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={loadApi} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'mdix.load(path) / load_str(source)',              d: 'Load from a file path or an in-memory source string.' },
          { m: 'mdix.load_encrypted(encPath, keyPath = "")',      d: 'Load an encrypted file, key from a file or auto-detected.' },
          { m: 'mdix.load_encrypted_password(encPath, password)', d: 'Load an encrypted file, key derived from a password.' },
          { m: 'mdix.load_encrypted_bytes(bytes, keyContent, password = "")', d: 'Load encrypted data already in memory.' },
          { m: 'mdix.from_json(json) / from_toml(toml)',           d: 'Load from a foreign format string.' },
          { m: 'mdix.destroy(&db)',                                d: 'Free the native handle.' },
          { m: 'mdix.is_valid(db)',                                d: 'True if the handle is valid.' },
          { m: 'mdix.validate(source)',                            d: 'Syntax check only, without keeping a handle.' },
          { m: 'mdix.version()',                                   d: 'The Runtime crate version string.' },
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
