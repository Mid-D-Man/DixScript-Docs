<!-- src/lib/components/docs/sections/python/DocPythonReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `db.exists("server.host")           # bool
db.get_type("server.port")         # str, e.g. "int"
db.get_array_length("enemies")     # int
db.get_keys(prefix="")             # List[str]

db.get_string("server.host", default=None)
db.get_int("server.port", default=None)
db.get_long("session_id", default=None)
db.get_float("ratio", default=None)
db.get_double("pi", default=None)
db.get_bool("debug", default=None)
db.get_json("server")              # raw JSON string of a nested object/array
db.get_enum_name("log_level")      # "LogLevel"
db.get_enum_field("log_level")     # "INFO"

# try_* twins — return MdixResult instead of raising
db.try_get_string("server.host")
db.try_get_int("server.port")
db.try_get_long("session_id")
db.try_get_float("ratio")
db.try_get_double("pi")
db.try_get_bool("debug")
db.try_get_json("server")

# Export
db.to_json(indented=True)
db.to_toml()
db.to_mdix()
data = db.to_table()               # -> dict, via json.loads internally`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={readApi} lang="python" />

  <p>
    <code>to_table()</code> is the reading-side counterpart to
    <code>MdixDatabase.from_table()</code> on
    <a href="#python-api--loading">Loading</a> — a plain
    <code>dict</code>/<code>list</code> structure instead of a JSON string,
    for handing data to code that already expects native Python types.
    Also on <code>MdixDatabase</code> but not shown above:
    <code>validate_schema(schema)</code> — the same validation
    <a href="#python-api--schema"><code>MdixSchemaBuilder.validate(db)</code></a>
    does, called from the database side instead.
  </p>

  <p>
    Unlike the Go, Java, and PHP bindings, there's no
    <code>get_enum_value</code> here — only <code>get_enum_name</code> (the
    enum's type name) and <code>get_enum_field</code> (the field name).
    Checked directly against <code>database.rs</code>: if you need the
    underlying integer value, there's currently no binding method for it.
  </p>
</div>

