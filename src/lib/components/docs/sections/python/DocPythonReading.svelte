<!-- src/lib/components/docs/sections/python/DocPythonReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const exampleMdix = `@DATA(
  debug<bool> = true

  server:
    host = "localhost"
    port<int> = 8080

  session_id<long> = 9007199254740993
  ratio<float> = 0.75
  pi<double> = 3.14159265

  enemies:: { name = "Goblin", hp = 50 }, { name = "Orc", hp = 100 }
)`;

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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '.exists(path)',                    d: 'True if a value exists at path.' },
          { m: '.get_type(path)',                   d: 'The stored type as a string, e.g. "int", "string", "array".' },
          { m: '.get_array_length(path)',            d: 'Number of elements at an array path.' },
          { m: '.get_keys(prefix="")',               d: 'Direct child keys under prefix (top level if empty).' },
          { m: '.get_string/int/long/float/double/bool(path, default=None)', d: 'Typed getters — default is returned instead of raising when the path is missing.' },
          { m: '.get_json(path)',                    d: 'Raw JSON string of a nested object/array at path.' },
          { m: '.get_enum_name/get_enum_field(path)', d: 'The enum type name / the field name at path.' },
          { m: '.try_get_*(path)',                   d: 'Railway twin of every getter above — returns MdixResult instead of raising.' },
          { m: '.to_json(indented=True) / .to_toml() / .to_mdix()', d: 'Export the whole database as source text.' },
          { m: '.to_table()',                        d: 'Export as a plain dict/list structure, via json.loads internally.' },
          { m: '.validate_schema(schema)',           d: 'Validate against an MdixSchemaBuilder — same as schema.validate(db).' },
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

