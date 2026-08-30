<!-- src/lib/components/docs/sections/rust/DocRustSerde.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  server:
    host = "api.example.com"
    port<int> = 443
    ssl  = true
)`;

  const serializeApi = `use dixscript::Runtime::{DixDataBuilder, DixSerialize, DataBuilder, dix_set_str, dix_set_int};

struct ServerConfig { host: String, port: i32 }

impl DixSerialize for ServerConfig {
    fn to_dix(&self, d: &mut DataBuilder, prefix: &str) -> Result<(), String> {
        dix_set_str(d, prefix, "host", &self.host);
        dix_set_int(d, prefix, "port", self.port);
        Ok(())
    }
}

let data = DixDataBuilder::new()
    .serialize_at("server", &ServerConfig { host: "localhost".into(), port: 8080 })
    .build()
    .unwrap();

// Scalar arrays (Vec<i32>, Vec<String>, Vec<bool>, ...) implement DixSerialize
// directly via a blanket impl, writing a GroupArray at prefix:
let data = DixDataBuilder::new()
    .serialize_at("scores", &vec![10, 20, 30])
    .build()
    .unwrap();

// Struct arrays use dix_set_array_of — the write-side mirror of dix_array_of:
let data = DixDataBuilder::new()
    .data(|d| {
        d.with_string("title", "Cluster");
        dix_set_array_of(d, "", "servers", &servers).unwrap();
    })
    .build()
    .unwrap();`;

  const deserializeApi = `use dixscript::Runtime::{DixData, DixDeserialize, dix_get, dix_get_or};

#[derive(Debug)]
pub struct ServerConfig {
    pub host: String,
    pub port: i32,
    pub ssl:  bool,
}

impl DixDeserialize for ServerConfig {
    fn from_dix(data: &DixData, prefix: &str) -> Result<Self, String> {
        Ok(ServerConfig {
            host: dix_get(data, prefix, "host")?,
            port: dix_get(data, prefix, "port")?,
            ssl:  dix_get_or(data, prefix, "ssl", false),
        })
    }
}

// Reads the "server" table from the config.mdix example above
let loader = DixLoader::new();
let data   = loader.load_text("config.mdix", &DixLoadOptions::new())?;
let server: ServerConfig = data.deserialize_at("server")?;
println!("{}", server.host); // api.example.com

// All field paths inside from_dix() are resolved relative to prefix.
// Pass "" to deserialize_at() to read from the top level instead of a nested path.`;
</script>

<div class="doc-page">
  <h1>Serde Support — DixSerialize &amp; DixDeserialize</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Implement these two
    traits to read and write your own structs directly against
    <a href="#rust-api--query"><code>DixData</code></a> /
    <a href="#rust-api--builder"><code>DixDataBuilder</code></a> without
    hand-rolling field-by-field conversions.
  </p>

  <h2>Example .mdix file</h2>
  <p>Deserializes straight into the <code>ServerConfig</code> struct below via <code>deserialize_at("server")</code>.</p>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <h2>DixSerialize — Writing Structs</h2>
  <p>
    Implement <code>to_dix</code> for a struct and hand it to
    <code>DixDataBuilder::serialize</code> /
    <code>DixDataBuilder::serialize_at</code>. Scalar arrays get a blanket
    impl for free; struct arrays go through <code>dix_set_array_of</code>.
  </p>
  <CodeBlock code={serializeApi} lang="rust" />

  <h2>DixDeserialize — Reading Structs</h2>
  <p>
    Implement <code>from_dix</code> for a struct, then call
    <code>DixData::deserialize_at</code> (or <code>deserialize</code> for
    the top level) to read it back out. All field paths inside
    <code>from_dix</code> resolve relative to the given <code>prefix</code>.
  </p>
  <CodeBlock code={deserializeApi} lang="rust" />

  <div class="tip-callout">
    <strong>Serde traits vs plain get&lt;T&gt; calls</strong>
    <ul>
      <li><strong>Use <code>DixSerialize</code>/<code>DixDeserialize</code></strong> once a struct's fields stop fitting on one line, or you read/write the same shape from more than one call site — it turns a pile of repeated <code>data.get(...)</code> calls into one implementation you write once.</li>
      <li><strong>Use plain <code>data.get::&lt;T&gt;(path)</code></strong> for a one-off read of two or three fields — implementing a trait for something you touch once is pure ceremony.</li>
      <li><strong>Avoid</strong> mixing the two styles for the <em>same</em> struct across your codebase — pick one so a future reader isn't left wondering why <code>ServerConfig</code> is read three different ways in three different files.</li>
    </ul>
  </div>

  <h2>Helper Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Helper</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'dix_get::<T>(data, prefix, field)',        d: 'Read a required field, resolved as prefix.field. Errors if missing/wrong type.' },
          { m: 'dix_get_or::<T>(data, prefix, field, def)', d: 'Read an optional field with a fallback default.' },
          { m: 'dix_nested::<T>(data, prefix, field)',      d: 'Read a nested struct implementing DixDeserialize.' },
          { m: 'dix_array_of::<T>(data, prefix, field)',    d: 'Read a GroupArray of structs implementing DixDeserialize.' },
          { m: 'dix_value(data, prefix, field)',            d: 'Raw Option<&DixValue> access, bypassing the trait system.' },
          { m: 'dix_path(prefix, field)',                   d: 'Utility — joins prefix and field into a dotted path.' },
          { m: 'dix_set_str/int/long/float/double/bool(d, prefix, field, value)', d: 'Write-side primitives, mirror of the dix_get_* family.' },
          { m: 'dix_set_nested::<T>(d, prefix, field, value)', d: 'Write a nested struct implementing DixSerialize.' },
          { m: 'dix_set_array_of::<T>(d, prefix, field, values)', d: 'Write a GroupArray of structs implementing DixSerialize.' },
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

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
