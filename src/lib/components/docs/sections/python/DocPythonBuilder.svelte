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
      .set_bool("ssl", True)
      .set_date("release", "2025-12-31")
      .set_hex_color("brand", "#2D6A9F")
      .set_enum("log_level", "LogLevel", "INFO")
      # tier 2 — grouped, after all flat properties
      .with_table_properties("server", {"host": "localhost", "port": 8080})
      .with_group_array("enemies", [
          {"name": "Goblin", "hp": 50},
          {"name": "Orc",    "hp": 100},
      ])
      .to_database())

# Or get the source string / a railway result instead of raising
src = MdixBuilder().set_string("a", "b").serialize()
result = MdixBuilder().set_string("a", "b").try_to_database()

# reset_grouped() / reset() clear tier-2-only or everything, same as the
# Lua and Go builders, for reusing a builder across multiple generations.`;
</script>

<div class="doc-page">
  <h1>MdixBuilder — Building Programmatically</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>. Two-tier
    <code>@DATA</code> ordering is enforced: flat properties must be
    added before any table properties or group arrays, same as every
    other language binding.
  </p>
  <CodeBlock code={builderApi} lang="python" />
</div>
