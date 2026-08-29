<!-- src/lib/components/docs/sections/python/DocPythonReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `db.exists("server.host")           # bool
db.get_type("server.port")         # str, e.g. "int"
db.get_array_length("enemies")     # int
db.get_keys(prefix="")             # List[str]

db.get_string("server.host", default=None)
db.get_int("server.port", default=None)
db.get_float("ratio", default=None)
db.get_double("pi", default=None)
db.get_bool("debug", default=None)
db.get_json("server")              # raw JSON string of a nested object/array
db.get_enum_name("log_level")      # "LogLevel"
db.get_enum_field("log_level")     # "INFO"

# try_* twins — return MdixResult instead of raising
db.try_get_string("server.host")
db.try_get_int("server.port")
db.try_get_float("ratio")
db.try_get_double("pi")
db.try_get_bool("debug")
db.try_get_json("server")

# Export
db.to_json(indented=True)
db.to_toml()
db.to_mdix()`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={readApi} lang="python" />
</div>
