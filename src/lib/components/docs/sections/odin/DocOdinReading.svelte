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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'entry_count/is_encrypted/is_compressed(db)', d: 'Metadata about the loaded database.' },
          { m: 'loaded_version(db) / config_value(db, key)', d: 'Version recorded in the file itself / a @CONFIG field.' },
          { m: 'exists(db, path)',                  d: 'True if a value exists at path.' },
          { m: 'get_type(db, path)',                 d: 'The stored type as an ffi.Mdix_Type.' },
          { m: 'array_length(db, path)',              d: 'Number of elements at an array path.' },
          { m: 'get_string/int/long/float/double/bool(db, path)', d: 'Typed getters, each returning (value, ok).' },
          { m: 'get_enum_name/get_enum_field(db, path)', d: 'Enum type name / field name.' },
          { m: 'get_json(db, path)',                  d: 'Raw JSON string of a nested object/array at path.' },
          { m: 'select_many_as_json(db, pattern)',    d: 'Whole-segment wildcard match, returned as a JSON string.' },
          { m: 'get_keys(db, prefix) / get_all_keys(db)', d: 'Direct child keys under prefix, or every leaf path recursively.' },
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
