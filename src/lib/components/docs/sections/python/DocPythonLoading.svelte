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

  const tableApi = `# from_table() — build a database directly from a dict/list structure,
# the reverse of to_table() (see Reading Values). Routes through
# json.dumps() + from_json() under the hood, no second hand-written
# converter to keep in sync with the JSON path.
db2 = MdixDatabase.from_table({"app_name": "MyGame", "port": 8080})`;
</script>

<div class="doc-page">
  <h1>Loading</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>. Every direct
    loader has a <code>try_*</code> twin returning
    <a href="#python-api--result"><code>MdixResult</code></a> instead of
    raising — see that page for the railway-style chaining pattern.
  </p>
  <CodeBlock code={loadingApi} lang="python" />

  <h2>Loading from a dict</h2>
  <p>
    <code>from_table()</code> builds a database directly from a plain
    Python <code>dict</code>/<code>list</code> structure — the loading-side
    counterpart to <code>to_table()</code> on
    <a href="#python-api--reading">Reading Values</a>.
  </p>
  <CodeBlock code={tableApi} lang="python" />

  <p>
    There's no <code>load_encrypted_bytes</code>-style in-memory encrypted
    loader here — only the file-path-based <code>load_encrypted</code>/
    <code>load_encrypted_password</code>. Checked directly against
    <code>database.rs</code>'s static methods; if you need to load
    encrypted bytes already in memory, write them to a temp file first.
  </p>
</div>


