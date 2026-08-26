<!-- src/lib/components/docs/sections/rust/DocRustQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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
</script>

<div class="doc-page">
  <h1>DixData — Querying Loaded Data</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Returned by every
    <a href="#rust-api--loader"><code>DixLoader</code></a> call — the read-side
    handle for everything DixScript compiled.
  </p>

  <CodeBlock code={dixDataApi} lang="rust" />

  <h3>Wildcard queries with select_many</h3>
  <CodeBlock code={selectManyExample} lang="rust" />

  <h2>Method Reference</h2>
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

  <h2>TryFrom&lt;DixValue&gt; Implementations</h2>
  <p>
    <code>DixData.get&lt;T&gt;()</code> works for any <code>T</code> that implements
    <code>TryFrom&lt;DixValue&gt;</code>. The following are provided out of the box.
    You can implement the trait for your own types.
  </p>
  <CodeBlock code={tryFromApi} lang="rust" />

  <h2>DixValue — The Runtime Value Enum</h2>
  <CodeBlock code={dixValueVariants} lang="rust" />
</div>
