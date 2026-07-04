<!-- src/lib/components/docs/sections/DocOdinApi.svelte -->
<script lang="ts">
  const install = `# 1. Build the native library from DixScript-Rust:
cargo build --release -p mdix-ffi
# Linux:   target/release/libmdix_ffi.so
# macOS:   target/release/libmdix_ffi.dylib
# Windows: target/release/mdix_ffi.dll + mdix_ffi.lib

# 2. Link from Odin — mdix_ffi/mdix_ffi.odin uses:
#      foreign import "system:mdix_ffi"          (system:mdix_ffi.lib on Windows)
odin build . -extra-linker-flags:"-L/path/to/lib -Wl,-rpath,/path/to/lib"
# Windows/MSVC: -extra-linker-flags:"/LIBPATH:C:\\path\\to\\lib"

# Or drop the library next to your executable, or install to a standard
# system path — same rules as mdix-c.`;

  const quickStart = `import "mdix"
import "core:fmt"

main :: proc() {
    db, ok := mdix.load_str(\`@DATA( port = 8080, host = "localhost" )\`)
    if !ok {
        fmt.println("load failed:", mdix.last_error())
        return
    }
    defer mdix.destroy(&db)

    port, _ := mdix.get_int(db, "port")
    host, _ := mdix.get_string(db, "host")
    defer delete(host)   // string-returning procs are caller-owned

    fmt.println(host, port)
}`;

  const valueOkPattern = `// Every read follows Odin's (value, ok) convention — no exceptions,
// no null-sentinel + separate error check like the raw C API.
port, ok := mdix.get_int(db, "server.port")
if !ok {
    fmt.println("read failed:", mdix.last_error())
}

// String-returning procs take an optional allocator (defaults to
// context.allocator) and the result is caller-owned — delete() it:
host, ok := mdix.get_string(db, "server.host", allocator = context.allocator)
defer delete(host)

// Values going IN (path/value arguments) are converted via
// context.temp_allocator. In long-running loops with no surrounding
// temp scope, call free_all(context.temp_allocator) yourself.
mdix.last_error()    // string — most recent error message
mdix.clear_error()   // clear it explicitly`;

  const loadApi = `db, ok := mdix.load(path)
db, ok := mdix.load_str(source)
db, ok := mdix.load_encrypted(enc_path, key_path = "")
db, ok := mdix.load_encrypted_password(enc_path, password)
db, ok := mdix.load_encrypted_bytes(bytes, key_content, password = "")
db, ok := mdix.from_json(json_source)
db, ok := mdix.from_toml(toml_source)
defer mdix.destroy(&db)

mdix.is_valid(db)      // bool
mdix.validate(source)  // bool — parse/validate without keeping a handle
mdix.version()         // string — runtime version`;

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

  const exportApi = `mdix.to_json(db, indented = true)   // (string, bool)
mdix.to_toml(db)                     // (string, bool)
mdix.to_mdix(db)                     // (string, bool)

mdix.format_source(source)           // (string, bool)
mdix.minify_source(source)           // string
mdix.compact_source(source)          // string — whitespace-only compaction
mdix.strip_comments(source)          // string — comments removed, formatting kept`;

  const builderApi = `b := mdix.builder_new()
defer mdix.builder_destroy(&b)

mdix.builder_set_string(b, "app_name", "MyGame")
mdix.builder_set_int(b, "port", 8080)
mdix.builder_set_long(b, "session_id", 9_000_000_000)
mdix.builder_set_float(b, "ratio", 0.75)
mdix.builder_set_double(b, "pi", 3.14159)
mdix.builder_set_bool(b, "ssl", true)

mdix.builder_has_key(b, "app_name")   // bool
mdix.builder_remove(b, "app_name")    // bool
mdix.builder_entry_count(b)           // int
mdix.builder_clear(b)                 // bool — reset everything

// Read back values already staged in the builder
name, ok := mdix.builder_get_string(b, "app_name")
defer delete(name)

// Finish
ok = mdix.builder_save(b, "profile.mdix")
src, ok := mdix.builder_to_string(b)
defer delete(src)
db, ok := mdix.builder_to_database(b)
defer mdix.destroy(&db)

// Round-trip an existing database into a builder to modify it
b2 := mdix.builder_from_database(db)`;
</script>

<div class="doc-page">
  <h1>Odin Runtime API</h1>
  <p class="page-lead">
    <code>mdix-odin</code> wraps the same <code>mdix_ffi</code> native
    library used by the C/C++ and Go bindings. It has the broadest raw
    surface of any wrapper — every read, every builder call, and even
    wildcard queries (<code>select_many_as_json</code>) and source
    transforms (<code>format_source</code> / <code>compact_source</code> /
    <code>strip_comments</code>) are exposed directly, following Odin's
    idiomatic <code>(value, ok)</code> convention instead of exceptions or
    a Result type.
  </p>

  <h2>Build &amp; Link</h2>
  <pre><code>{install}</code></pre>

  <h2>Quick Start</h2>
  <pre><code>{quickStart}</code></pre>

  <h2>The (value, ok) Pattern</h2>
  <p>
    No exceptions, no hidden allocation. String-returning procedures take
    an optional <code>allocator</code> parameter and hand back a
    caller-owned string — you <code>delete()</code> it. Values passed in go
    through <code>context.temp_allocator</code>.
  </p>
  <pre><code>{valueOkPattern}</code></pre>

  <h2>Loading</h2>
  <pre><code>{loadApi}</code></pre>

  <h2>Reading Values</h2>
  <pre><code>{readApi}</code></pre>

  <h2>Export &amp; Source Transforms</h2>
  <pre><code>{exportApi}</code></pre>

  <h2>Building Programmatically</h2>
  <pre><code>{builderApi}</code></pre>

  <h2>vs the raw C API</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Concept</th><th>C (mdix.h)</th><th>Odin (mdix package)</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Errors',   ch: 'NULL / false sentinel + mdix_get_last_error()', od: '(value, ok) return tuple, mdix.last_error()' },
          { c: 'Strings',  ch: 'caller must free with mdix_free_string()',       od: 'caller-owned via allocator, delete()' },
          { c: 'Handles',  ch: 'opaque pointer, manual free',                    od: 'Database/Builder structs, destroy()/builder_destroy()' },
          { c: 'Wildcards',ch: 'not exposed',                                    od: 'select_many_as_json(db, pattern)' },
          { c: 'Formatting', ch: 'not exposed',                                  od: 'format_source / minify_source / compact_source / strip_comments' },
        ] as row}
          <tr>
            <td style="font-weight:500">{row.c}</td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.ch}</td>
            <td><code style="font-size:0.75rem">{row.od}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
