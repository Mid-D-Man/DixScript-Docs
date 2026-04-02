<!-- src/lib/components/docs/sections/DocRustApi.svelte -->
<script lang="ts">
  const loaderBasic = `// Add to Cargo.toml:
// dixscript = { path = "../dixscript" }
// (or version once published to crates.io)

use dixscript::Runtime::{DixLoader, DixLoadOptions, DixData};

fn main() -> Result<(), String> {
    let loader = DixLoader::new();
    let opts   = DixLoadOptions::new();

    // Load a plain .mdix file — runs the full compilation pipeline
    let data: DixData = loader.load_text("config.mdix", &opts)?;

    // Read a typed value by dotted path
    let port: i32    = data.get("server.port")?;
    let host: String = data.get("server.host")?;
    let debug: bool  = data.get("debug")?;

    println!("{}:{} debug={}", host, port, debug);
    Ok(())
}`;

  const loaderFromStr = `use dixscript::Runtime::{DixLoader, DixLoadOptions};

fn load_inline() -> Result<(), String> {
    let source = r#"
        @DATA(
          app_name = "MyApp"
          port     = 8080
        )
    "#;

    let loader = DixLoader::new();
    let data   = loader.load_from_str(source, &DixLoadOptions::new())?;

    let name: String = data.get("app_name")?;
    let port: i32    = data.get("port")?;
    println!("{} on port {}", name, port);
    Ok(())
}`;

  const loaderEncrypted = `use dixscript::Runtime::{DixLoader, DixLoadOptions};

fn load_encrypted_keyfile() -> Result<(), String> {
    let loader = DixLoader::new();

    // Keyfile mode — key file must be alongside the .enc file,
    // or supply the path explicitly:
    let opts = DixLoadOptions::with_key_file("/vault/secrets.mdix.key");
    let data = loader.load_encrypted("secrets.mdix.enc", &opts)?;

    let api_key: String = data.get("api.key")?;
    Ok(())
}

fn load_encrypted_password() -> Result<(), String> {
    let loader = DixLoader::new();
    let opts   = DixLoadOptions::with_password("my-strong-password");
    let data   = loader.load_encrypted("secrets.mdix.enc", &opts)?;
    Ok(())
}

fn load_encrypted_bytes() -> Result<(), String> {
    // Both payload and key arrive from a network response — no disk access needed
    let encrypted_bytes: Vec<u8>  = fetch_from_vault_bytes();
    let key_file_content: String  = fetch_from_vault_key();

    let loader = DixLoader::new();
    let opts   = DixLoadOptions::new();
    let data   = loader.load_from_encrypted_bytes(
        &encrypted_bytes,
        &key_file_content,
        &opts,
    )?;
    Ok(())
}

fn fetch_from_vault_bytes() -> Vec<u8> { vec![] }  // placeholder
fn fetch_from_vault_key()   -> String  { String::new() }`;

  const dixDataApi = `use dixscript::Runtime::{DixData, DixValue};

fn using_dix_data(data: &DixData) {
    // --- get<T> — typed access, returns Result ---
    let port: i32    = data.get("server.port").unwrap_or(8080);
    let host: String = data.get("server.host").unwrap_or("localhost".into());

    // --- get_or_default<T> — typed access with inline fallback ---
    let timeout: i32 = data.get_or_default("timeout", 30000);

    // --- get_value — raw DixValue, no conversion ---
    if let Some(val) = data.get_value("feature_flags.checkout_v2") {
        println!("checkout_v2 raw: {}", val);
    }

    // --- exists — check presence without consuming ---
    if data.exists("analytics.endpoint") {
        println!("analytics configured");
    }

    // --- get_keys — list direct children of a path ---
    // Pass "" for top-level keys
    let top_level: Vec<String> = data.get_keys("");
    let db_fields: Vec<String> = data.get_keys("database");

    // --- select_many — wildcard pattern matching ---
    // "*" matches any single path segment
    let all_names: Vec<String> = data.select_many("enemies.*.name");
    let all_ports: Vec<i32>    = data.select_many("services.*.port");

    // --- entry_count — total entries in the flat store ---
    println!("{} total entries", data.entry_count());

    // --- to_hashmap — clone the full flat store ---
    let map = data.to_hashmap();
    for (key, value) in &map {
        println!("{} = {}", key, value);
    }
}`;

  const dixValueVariants = `use dixscript::Runtime::DixValue;

fn matching_dix_value(val: DixValue) {
    match val {
        DixValue::Null              => println!("null"),
        DixValue::Bool(b)           => println!("bool: {}", b),
        DixValue::Int(i)            => println!("int: {}", i),
        DixValue::Float(f)          => println!("float: {}f", f),
        DixValue::Double(d)         => println!("double: {}", d),
        DixValue::String(s)         => println!("string: {}", s),
        DixValue::Date(d)           => println!("date: {}", d),
        DixValue::Timestamp(t)      => println!("timestamp: {}", t),
        DixValue::HexColor(c)       => println!("hex color: {}", c),
        DixValue::Blob(b)           => println!("blob: {} chars of base64", b.len()),
        DixValue::Regex(r)          => println!("regex: {}", r),
        DixValue::Array(arr)        => println!("array: {} elements", arr.len()),
        DixValue::Object(obj)       => println!("object: {} keys", obj.len()),
        DixValue::Tuple(items)      => println!("tuple: {} elements", items.len()),
        DixValue::Enum { enum_name, field_name, value } =>
            println!("{}.{} = {}", enum_name, field_name, value),
    }
}

// Helper accessors (return Option):
fn using_helpers(val: &DixValue) {
    if let Some(i) = val.as_int()    { println!("as int: {}", i); }
    if let Some(f) = val.as_float()  { println!("as float: {}", f); }
    if let Some(s) = val.as_string() { println!("as str: {}", s); }
    if let Some(a) = val.as_array()  { println!("as array: {} items", a.len()); }
    if let Some(o) = val.as_object() { println!("as object: {} keys", o.len()); }
    println!("type name: {}", val.type_name());
    println!("is null: {}", val.is_null());
}`;

  const builderApi = `use dixscript::Runtime::{DixDataBuilder, DixData};

fn using_builder() -> Result<DixData, String> {
    DixDataBuilder::new()
        // @CONFIG metadata (optional)
        .config(|c| {
            c.with_version("2.0.0");
            c.with_author("MyApp");
            c.with_features("advanced");
        })
        // @ENUMS (optional)
        .enums(|e| {
            e.with_enum("Environment", &["DEV", "STAGING", "PROD"]);
            e.with_enum_values("LogLevel", &[
                ("DEBUG", 0), ("INFO", 1), ("WARN", 2), ("ERROR", 3),
            ]);
        })
        // @DATA — flat properties MUST come before tables/arrays
        .data(|d| {
            // Flat properties first:
            d.with_string("app_name", "MyApp");
            d.with_int("port", 8080);
            d.with_bool("debug", false);

            // Table properties (Tier 2A):
            d.with_table_properties("database", |t| {
                t.with_string("host", "db.internal");
                t.with_int("port", 5432);
                t.with_bool("ssl", true);
            });

            d.with_table_properties("logging", |t| {
                t.with_string("level", "INFO");
                t.with_bool("json_output", true);
            });

            // Group arrays (Tier 2B):
            d.with_group_array_builder("allowed_ips", |arr| {
                arr.add_string("10.0.0.1");
                arr.add_string("10.0.0.2");
                arr.add_string("10.0.0.3");
            });
        })
        .build()
}`;

  const builderViolation = `use dixscript::Runtime::DixDataBuilder;

fn two_tier_violation() {
    // This returns Err — flat properties after a table property violates
    // DixScript's two-tier ordering rule.
    // build() collects ALL violations before returning, so you see them all.
    let result = DixDataBuilder::new()
        .data(|d| {
            d.with_table_properties("database", |t| {
                t.with_string("host", "localhost");
            });
            // WRONG — flat property after grouped data:
            d.with_string("app_name", "MyApp");    // violation 1
            d.with_int("port", 8080);              // violation 2
        })
        .build();

    assert!(result.is_err());
    println!("{}", result.unwrap_err());
    // "Cannot add flat property 'app_name' after table properties or group arrays..."
    // "Cannot add flat property 'port' after table properties or group arrays..."
}`;

  const loadOptionsApi = `use dixscript::Runtime::DixLoadOptions;
use std::time::Duration;

fn load_options_examples() {
    // Default — no encryption, auto-locate key if needed
    let default_opts = DixLoadOptions::new();

    // Password mode
    let pw_opts = DixLoadOptions::with_password("my-strong-password");

    // Explicit key file
    let key_opts = DixLoadOptions::with_key_file("/vault/app.mdix.key");

    // Key search paths — checked in order when auto-locating
    let search_opts = DixLoadOptions::with_key_search_paths(vec![
        "/etc/myapp/keys".into(),
        "/vault/keys".into(),
    ]);

    // Direct key file content (requires security acknowledgment)
    let direct = DixLoadOptions::with_key_content(
        vault_client_fetch_key(),
        true,  // acknowledge_security_risk — only use from a trusted vault
    ).expect("acknowledged");

    // URL-based key loading (requires HTTPS + acknowledgment)
    let url = DixLoadOptions::with_key_url(
        "https://vault.internal/secret/app.mdix.key",
        true,
    ).expect("https + acknowledged");

    // Fine-grained control via field mutation:
    let mut opts = DixLoadOptions::new();
    opts.validate_checksums       = true;
    opts.throw_on_missing_sections = false;
    opts.output_directory          = Some("/tmp/output".into());
}

fn vault_client_fetch_key() -> String { String::new() } // placeholder`;

  const converterApi = `use dixscript::Runtime::{DixConverter, DixFormatOptions};
use std::collections::HashMap;

fn converter_examples() -> Result<(), String> {
    let converter = DixConverter::new();

    // --- HashMap -> AST -> .mdix text ---
    let mut data = HashMap::new();
    data.insert("port".into(),    dixscript::Runtime::DixValue::Int(8080));
    data.insert("host".into(),    dixscript::Runtime::DixValue::String("localhost".into()));
    data.insert("debug".into(),   dixscript::Runtime::DixValue::Bool(false));

    let ast  = converter.from_hashmap(data)?;
    let mdix = converter.to_mdix(&ast, None)?;
    println!("{}", mdix);

    // --- AST -> JSON ---
    let json_pretty  = converter.to_json(&ast, true)?;
    let json_compact = converter.to_json(&ast, false)?;

    // --- JSON string -> AST ---
    let json_input = r#"{"port": 8080, "host": "localhost"}"#;
    let from_json  = converter.from_json(json_input)?;

    // --- AST -> TOML ---
    let toml = converter.to_toml(&ast)?;

    // --- TOML string -> AST ---
    let toml_input = "port = 8080\nhost = \"localhost\"";
    let from_toml  = converter.from_toml(toml_input)?;

    // --- Custom format options ---
    let opts_pretty   = DixFormatOptions::pretty();
    let opts_minified = DixFormatOptions::minified();
    let opts_compact  = DixFormatOptions::compact();

    let styled = converter.to_mdix(&ast, Some(&opts_pretty))?;
    Ok(())
}`;

  const formatOptionsApi = `use dixscript::Runtime::DixFormatOptions;

fn format_options_reference() {
    // Built-in presets:
    let default   = DixFormatOptions::new();
    let pretty    = DixFormatOptions::pretty();
    let compact   = DixFormatOptions::compact();
    let minified  = DixFormatOptions::minified();

    // Manual construction:
    let custom = DixFormatOptions {
        indented:                true,
        indent_size:             2,
        use_tabs:                false,
        minify:                  false,
        include_comments:        true,
        sort_keys:               false,
        include_type_annotations:false,
        escape_unicode:          false,
        max_line_length:         0,
        include_config_section:  true,
        include_version:         true,
    };

    println!("{:?}", custom.get_indentation(1)); // "  "
    println!("{:?}", custom.get_indentation(2)); // "    "
    println!("{:?}", custom.get_newline());       // "\\n"
    println!("{:?}", custom.get_space());         // " "
}`;

  const compactorApi = `use dixscript::Runtime::DixCompactor;

fn compactor_examples() {
    let source = r#"
        // This is a comment
        @CONFIG(
          version -> "1.0.0"
        )

        @DATA(
          name = "MyApp"
          port = 8080
        )
    "#;

    let minified    = DixCompactor::minify(source);
    let compacted   = DixCompactor::compact(source);
    let no_comments = DixCompactor::remove_comments(source);

    let ratio = DixCompactor::get_compression_ratio(source, &minified);
    println!("Minified by {:.1}%", ratio * 100.0);
}`;

  const tryFromApi = `use dixscript::Runtime::{DixData, DixValue};

fn try_from_examples(data: &DixData) -> Result<(), String> {
    // String <- DixValue::String | Date | Timestamp | HexColor
    let host: String = data.get("server.host")?;

    // i32 <- DixValue::Int | Float | Double | Enum
    let port: i32 = data.get("server.port")?;

    // f64 <- DixValue::Int | Float | Double
    let ratio: f64 = data.get("compression.ratio")?;

    // bool <- DixValue::Bool
    let debug: bool = data.get("debug")?;

    // Vec<DixValue> <- DixValue::Array
    let tags: Vec<DixValue> = data.get("tags")?;

    // HashMap<String, DixValue> <- DixValue::Object
    use std::collections::HashMap;
    let db_obj: HashMap<String, DixValue> = data.get("database")?;

    Ok(())
}

// Implement TryFrom<DixValue> for your own types:
use dixscript::Runtime::DixValue;

struct ServerConfig { host: String, port: i32 }

impl TryFrom<DixValue> for ServerConfig {
    type Error = String;
    fn try_from(val: DixValue) -> Result<Self, Self::Error> {
        let obj = val.as_object()
            .ok_or("expected object")?;
        let host = obj.get("host")
            .and_then(|v| v.as_string().map(|s| s.to_string()))
            .ok_or("missing host")?;
        let port = obj.get("port")
            .and_then(|v| v.as_int())
            .ok_or("missing port")?;
        Ok(ServerConfig { host, port })
    }
}`;

  const selectManyExample = `use dixscript::Runtime::DixData;

fn wildcard_queries(data: &DixData) {
    let names: Vec<String> = data.select_many("enemies.*.name");
    let ports: Vec<i32>    = data.select_many("services.*.port");
    let nested: Vec<String> = data.select_many("config.*.host");

    let service_indices = data.get_keys("services");
    for idx in service_indices {
        let path = format!("services.{}.host", idx);
        if let Ok(host) = data.get::<String>(&path) {
            println!("service host: {}", host);
        }
    }
}`;
</script>

<div class="doc-page">
  <h1>Rust Runtime API</h1>
  <p class="page-lead">
    The <code>dixscript</code> crate exposes a pure-Rust API for loading, querying,
    building, and converting DixScript data at runtime. The main entry points are
    <code>DixLoader</code> (loading files), <code>DixData</code> (querying data),
    <code>DixDataBuilder</code> (creating data programmatically), and
    <code>DixConverter</code> (format conversion). All types live in the
    <code>dixscript::Runtime</code> module.
  </p>

  <div class="warn-callout">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008z"/>
    </svg>
    <span>
      The Rust port is under active development. The API compiles and the
      types are stable, but runtime execution depends on the parser/compiler
      reaching parity with the C# reference implementation.
      Track progress on the <a href="/results">CI Results</a> page.
    </span>
  </div>

  <h2>DixLoader — Loading Files</h2>

  <h3>Load a plain .mdix file</h3>
  <pre><code>{loaderBasic}</code></pre>

  <h3>Load from a string</h3>
  <pre><code>{loaderFromStr}</code></pre>

  <h3>Load encrypted files</h3>
  <pre><code>{loaderEncrypted}</code></pre>

  <h2>DixLoader Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'DixLoader::new()',                          d: 'Create a loader with an isolated error manager. Each instance owns its own error state — parallel loads never mix.' },
          { m: 'loader.load_text(path, &opts)',             d: 'Load and compile a plain .mdix file from disk. Runs the full pipeline: tokenize → parse → semantic analysis → AST enhancement → value resolution.' },
          { m: 'loader.load_from_str(source, &opts)',       d: 'Compile DixScript source from a string. No disk access. DLM file-output steps are skipped.' },
          { m: 'loader.load_encrypted(path, &opts)',        d: 'Load an encrypted .mdix.enc file. Locates the key file automatically or uses the path/password from DixLoadOptions.' },
          { m: 'loader.load_from_encrypted_bytes(&bytes, key_content, &opts)', d: 'Decrypt and load from raw bytes and key file content. No files written except temporary ones that are immediately cleaned up.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>DixLoadOptions — Configuring the Loader</h2>
  <pre><code>{loadOptionsApi}</code></pre>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Constructor / field</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { f: 'DixLoadOptions::new()',              d: 'Default options — no encryption, validate checksums, Strict compatibility.' },
          { f: 'DixLoadOptions::with_password(pw)',  d: 'Password-mode decryption.' },
          { f: 'DixLoadOptions::with_key_file(path)',d: 'Explicit key file path.' },
          { f: 'DixLoadOptions::with_key_content(content, ack)', d: 'Direct key file content from a trusted vault. Requires ack = true.' },
          { f: 'DixLoadOptions::with_key_url(url, ack)',         d: 'HTTPS-only URL for key file. Requires ack = true.' },
          { f: 'DixLoadOptions::with_key_search_paths(paths)',   d: 'Additional directories to search when auto-locating the key file.' },
          { f: '.validate_checksums',         d: 'bool — verify integrity hashes on load (default: true).' },
          { f: '.output_directory',           d: 'Option<String> — where to write .enc/.key/.au files (default: same directory as source).' },
          { f: '.throw_on_missing_sections',  d: 'bool — error if an expected section is absent (default: false).' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.f}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>DixData — Querying Loaded Data</h2>
  <pre><code>{dixDataApi}</code></pre>

  <h3>Wildcard queries with select_many</h3>
  <pre><code>{selectManyExample}</code></pre>

  <h2>DixData Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'data.get::<T>(path)',             r: 'Result<T, String>',            d: 'Typed value lookup. Converts via TryFrom<DixValue>. Returns Err if missing or wrong type.' },
          { m: 'data.get_or_default::<T>(path, default)', r: 'T',                   d: 'Returns default if the key is missing or conversion fails. Never returns Err.' },
          { m: 'data.get_value(path)',             r: 'Option<&DixValue>',           d: 'Raw DixValue reference. No type conversion.' },
          { m: 'data.exists(path)',                r: 'bool',                        d: 'True if the dotted path is present in the flat store.' },
          { m: 'data.get_keys(path)',              r: 'Vec<String>',                 d: 'Direct child segment names under path. Pass "" for top-level.' },
          { m: 'data.select_many::<T>(pattern)',   r: 'Vec<T>',                     d: 'All values matching a wildcard pattern. "*" matches one segment.' },
          { m: 'data.entry_count()',               r: 'usize',                       d: 'Total entries in the flat store including indexed array elements.' },
          { m: 'data.to_hashmap()',                r: 'HashMap<String, DixValue>',   d: 'Clone the entire flat store as a HashMap.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td><code style="color:var(--primary);font-size:0.75rem">{row.r}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- THE FIX: escaped angle brackets so Svelte doesn't treat <DixValue> as an HTML tag -->
  <h2>TryFrom&lt;DixValue&gt; Implementations</h2>
  <p>
    <code>DixData.get&lt;T&gt;()</code> works for any <code>T</code> that implements
    <code>TryFrom&lt;DixValue&gt;</code>. The following are provided out of the box.
    You can implement the trait for your own types.
  </p>
  <pre><code>{tryFromApi}</code></pre>

  <h2>DixValue — The Runtime Value Enum</h2>
  <pre><code>{dixValueVariants}</code></pre>

  <h2>DixDataBuilder — Building Data Programmatically</h2>
  <p>
    The fluent builder creates <code>DixData</code> in memory without needing a
    <code>.mdix</code> source file. It enforces DixScript's two-tier ordering rule:
    flat properties must be added before any table properties or group arrays.
    Violations are collected rather than panicking so all errors are reported at once.
  </p>
  <pre><code>{builderApi}</code></pre>

  <h3>Two-tier violations return Err — they never panic</h3>
  <pre><code>{builderViolation}</code></pre>

  <h2>DixDataBuilder Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'DixDataBuilder::new()',                      d: 'Create a new builder.' },
          { m: '.config(|c| { … })',                         d: 'Configure the @CONFIG section. Use c.with_version(), c.with_author(), c.with_features(), c.with_custom(key, val).' },
          { m: '.enums(|e| { … })',                          d: 'Declare enums. Use e.with_enum(name, &[field_names]) or e.with_enum_values(name, &[(name, i32)]).' },
          { m: '.data(|d| { … })',                           d: 'Configure data. Flat properties first, then tables/arrays.' },
          { m: '.with_version(v)',                           d: 'Set the version string on the builder (separate from @CONFIG version).' },
          { m: 'd.with_int(name, i32)',                      d: 'Add a flat integer property.' },
          { m: 'd.with_string(name, &str)',                  d: 'Add a flat string property.' },
          { m: 'd.with_bool(name, bool)',                    d: 'Add a flat boolean property.' },
          { m: 'd.with_float(name, f32)',                    d: 'Add a flat float property.' },
          { m: 'd.with_double(name, f64)',                   d: 'Add a flat double property.' },
          { m: 'd.with_date(name, NaiveDate)',               d: 'Add a flat date property.' },
          { m: 'd.with_hex_color(name, "#RRGGBB")',          d: 'Add a flat hex color. Must start with #.' },
          { m: 'd.with_array(name, Vec<Value>)',             d: 'Add a flat array property.' },
          { m: 'd.with_table_properties(path, |t| { … })',  d: 'Add a table block. Use t.with_string(), t.with_int(), etc. inside the closure.' },
          { m: 'd.with_group_array(path, Vec<Value>)',       d: 'Add a group array from a pre-built Vec.' },
          { m: 'd.with_group_array_builder(path, |a| { … })',d: 'Add a group array using a builder closure. Use a.add_string(), a.add_int(), a.add_value().' },
          { m: '.build()',                                    d: 'Consume the builder and produce DixData. Returns Err if any two-tier violations or validation errors were recorded.' },
          { m: '.build_and_save(path, opts)',                d: 'Build and write to a .dixscript file. Returns the output path as a String on success.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>DixConverter — Format Conversion</h2>
  <pre><code>{converterApi}</code></pre>

  <h2>DixFormatOptions — Controlling Output</h2>
  <pre><code>{formatOptionsApi}</code></pre>

  <h2>DixCompactor — Minification</h2>
  <pre><code>{compactorApi}</code></pre>
</div>
