<!-- src/lib/components/docs/sections/python/DocPythonBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `from midmanstudio.mdix import MdixBuilder

db = (MdixBuilder()
      .set_config("version", "1.0.0")
      .add_enum("LogLevel", ["DEBUG", "INFO", "WARN", "ERROR"])
      # tier 1 — flat properties must come first
      .set_string("app_name", "MyGame")
      .set_int("port", 8080)
      .set_long("session_id", 123456789)
      .set_float("scale", 1.5)
      .set_double("pi", 3.14159265)
      .set_bool("ssl", True)
      .set_date("release", "2025-12-31")
      .set_timestamp("built_at", "2025-01-01T00:00:00Z")
      .set_hex_color("brand", "#2D6A9F")
      .set_blob("thumbnail", b"\\x89PNG...")
      .set_regex("slug_pattern", r"^[a-z0-9-]+$")
      .set_enum("log_level", "LogLevel", "INFO")
      .set_array("tags", ["rpg", "indie"])
      .set_tuple("resolution", [1920, 1080])
      .set_object("meta", {"author": "Dev"})
      # tier 2 — grouped, after all flat properties
      .with_table_properties("server", {"host": "localhost", "port": 8080})
      .with_group_array("enemies", [
          {"name": "Goblin", "hp": 50},
          {"name": "Orc",    "hp": 100},
      ])
      .to_database())

# Or get the source string / a railway result instead of raising
src = MdixBuilder().set_string("a", "b").serialize()
result = MdixBuilder().set_string("a", "b").try_to_database()`;

  const resetApi = `b = MdixBuilder().set_string("a", "1").with_group_array("xs", [1, 2])

b.reset_grouped()   # clears tables + group arrays only — tier 1 stays,
                     # so you can add more flat properties again
b.reset()            # clears everything, including config and enums`;
</script>

<div class="doc-page">
  <h1>MdixBuilder — Building Programmatically</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>. Two-tier
    <code>@DATA</code> ordering is enforced: flat properties must be
    added before any table properties or group arrays, same as every
    other language binding. Calling a flat <code>set_*</code> after any
    <code>with_table_properties</code>/<code>with_group_array</code> raises
    <code>MdixError</code> immediately, not at <code>to_database()</code>
    time.
  </p>
  <CodeBlock code={builderApi} lang="python" />

  <p>
    <code>set_config()</code> and <code>add_enum()</code> are exempt from
    the two-tier rule — they emit into <code>@CONFIG</code>/<code>@ENUMS</code>,
    separate sections from <code>@DATA</code>, so they can appear anywhere
    relative to the flat/grouped property split.
  </p>

  <h2>Resetting a builder</h2>
  <p>
    For reusing one <code>MdixBuilder</code> across multiple generations
    rather than constructing a fresh one each time.
  </p>
  <CodeBlock code={resetApi} lang="python" />
</div>

