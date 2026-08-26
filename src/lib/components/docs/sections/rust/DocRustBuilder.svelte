<!-- src/lib/components/docs/sections/rust/DocRustBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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
</script>

<div class="doc-page">
  <h1>DixDataBuilder — Building Data Programmatically</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. The fluent builder
    creates <a href="#rust-api--query"><code>DixData</code></a> in memory
    without needing a <code>.mdix</code> source file. It enforces DixScript's
    two-tier ordering rule: flat properties must be added before any table
    properties or group arrays. Violations are collected rather than
    panicking so all errors are reported at once.
  </p>

  <CodeBlock code={builderApi} lang="rust" />

  <h3>Two-tier violations return Err — they never panic</h3>
  <CodeBlock code={builderViolation} lang="rust" />

  <h2>Method Reference</h2>
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
</div>
