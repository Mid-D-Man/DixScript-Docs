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
</div>
