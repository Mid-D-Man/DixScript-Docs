<!-- src/lib/components/docs/sections/c/DocCReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const readC = `mdix_entry_count(db)                 // int32_t
mdix_is_encrypted(db)                // bool — false if handle is NULL, not an error
mdix_is_compressed(db)               // bool — same
mdix_get_loaded_version(db)          // char* — version recorded in the file itself, free it
mdix_get_config_value(db, "author")  // char* — a @CONFIG field, free it

mdix_exists(db, "server.host")       // bool
mdix_get_type(db, "server.port")     // MdixType
mdix_get_array_length(db, "enemies") // int32_t

mdix_get_string(db, "server.host")   // char* — free it
mdix_get_int(db, "server.port")      // int32_t
mdix_get_long(db, "session_id")      // int64_t — also accepts Int values, widened
mdix_get_float(db, "ratio")          // float
mdix_get_double(db, "pi")            // double
mdix_get_bool(db, "debug")           // bool

mdix_get_enum_name(db, "log_level")  // char* -> "LogLevel", free it
mdix_get_enum_field(db, "log_level") // char* -> "INFO", free it

mdix_get_json(db, "server")          // char* — raw JSON for one fixed path, free it

int32_t n = 0;
char** keys = mdix_get_keys(db, "server", &n);      // direct children of "server"
mdix_free_string_array(keys, n);
char** all = mdix_get_all_keys(db, &n);              // every leaf path, recursive
mdix_free_string_array(all, n);`;

  const readCpp = `db->entry_count();                    // int32_t
db->is_encrypted(); db->is_compressed(); // bool
db->get_loaded_version();             // Result<std::string>
db->get_config_value("author");       // Result<std::string>

db->exists("server.host");            // bool
db->get_type("server.port");          // MdixType
db->get_array_length("enemies");      // int32_t

db->get_string("server.host");        // Result<std::string>
db->get_int("server.port");           // Result<int32_t>
db->get_long("session_id");           // Result<int64_t>
db->get_float("ratio");               // Result<float>
db->get_double("pi");                 // Result<double>
db->get_bool("debug");                // Result<bool>

db->get_enum_name("log_level");       // Result<std::string> -> "LogLevel"
db->get_enum_field("log_level");      // Result<std::string> -> "INFO"

db->get_json("server");               // Result<std::string>

std::vector<std::string> keys    = db->get_keys("server"); // no free needed
std::vector<std::string> allKeys = db->get_all_keys();`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#c-api">C / C++ Runtime API</a>.</p>
  <CodeBlock code={readC} lang="c" />
  <CodeBlock code={readCpp} lang="cpp" />
  <p>
    <code>get_keys()</code>/<code>get_all_keys()</code> in C++ return an owning
    <code>std::vector&lt;std::string&gt;</code> already copied out of the native
    array and freed — there's nothing to manually release, unlike the raw
    <code>char**</code> from <code>mdix_get_keys</code>/<code>mdix_get_all_keys</code>.
  </p>
</div>
