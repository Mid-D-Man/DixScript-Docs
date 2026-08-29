<!-- src/lib/components/docs/sections/python/DocPythonLoading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const loadingApi = `from midmanstudio.mdix import MdixDatabase

# Direct — raise on failure
MdixDatabase.load(path)
MdixDatabase.load_str(source)
MdixDatabase.from_json(json_str)
MdixDatabase.from_toml(toml_str)
MdixDatabase.load_encrypted(enc_path, key_path=None)
MdixDatabase.load_encrypted_password(enc_path, password)

# Railway — never raise
MdixDatabase.try_load(path)
MdixDatabase.try_load_str(source)
MdixDatabase.try_from_json(json_str)
MdixDatabase.try_from_toml(toml_str)`;
</script>

<div class="doc-page">
  <h1>Loading</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={loadingApi} lang="python" />
</div>
