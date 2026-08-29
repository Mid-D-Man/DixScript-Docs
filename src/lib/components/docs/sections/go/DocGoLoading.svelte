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
</div>
