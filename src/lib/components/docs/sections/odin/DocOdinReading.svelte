<!-- src/lib/components/docs/sections/odin/DocOdinReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `mdix.entry_count(db)                 // int
mdix.is_encrypted(db)                 // bool
mdix.is_compressed(db)                // bool
mdix.loaded_version(db)               // (string, bool)
mdix.config_value(db, "author")       // (string, bool) — a @CONFIG field

mdix.exists(db, "server.host")        // bool
mdix.get_type(db, "server.port")      // ffi.Mdix_Type
mdix.array_length(db, "enemies")      // int

mdix.get_string(db, "server.host")    // (string, bool)
mdix.get_int(db, "server.port")       // (int, bool)
mdix.get_long(db, "session_id")       // (i64, bool)
mdix.get_float(db, "ratio")           // (f32, bool)
mdix.get_double(db, "pi")             // (f64, bool)
mdix.get_bool(db, "debug")            // (bool, bool)

mdix.get_enum_name(db, "log_level")   // (string, bool) -> "LogLevel"
mdix.get_enum_field(db, "log_level")  // (string, bool) -> "INFO"

mdix.get_json(db, "server")                    // (string, bool) — raw JSON
mdix.select_many_as_json(db, "enemies[*].hp")  // (string, bool) — wildcard query

mdix.get_keys(db, prefix = "")   // []string — direct children of prefix
mdix.get_all_keys(db)             // []string — every leaf path`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={readApi} lang="odin" />
</div>
