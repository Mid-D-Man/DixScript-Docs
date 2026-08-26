<!-- src/lib/components/docs/sections/rust/DocRustSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const schemaApi = `use dixscript::Runtime::{SchemaBuilder, ExpectedValueType, ValidationErrorKind};

let schema = SchemaBuilder::new()
    .require_string("app_name")
    .require_int("server.port")
    .require_bool("ssl")
    .require_long("session_id")
    .require_array("enemies")
    .require_enum("log_level")
    .optional_string("description")
    .optional_bool("debug")
    // Generic form for any type, or with a custom validator closure:
    .require("custom.path", ExpectedValueType::Float)
    .require_with("port", ExpectedValueType::Int, |v| {
        matches!(v.as_i64(), Some(p) if p > 1024)
    })
    .with_description("basic app config");

let report = schema.validate(&data);
// or, equivalently: let report = data.validate_schema(schema);

if !report.is_valid() {
    for kind_err in report.errors_of_kind(&ValidationErrorKind::TypeMismatch) {
        println!("{}", kind_err);
    }
    println!("{} failed field(s): {:?}", report.error_count(), report.failed_paths());
}`;
</script>

<div class="doc-page">
  <h1>SchemaBuilder — Validation</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Fluent, declarative
    validation against a loaded <a href="#rust-api--query"><code>DixData</code></a>.
    Typed <code>require_*</code>/<code>optional_*</code> shorthands cover
    the common cases; <code>require</code>/<code>require_with</code> take
    an <code>ExpectedValueType</code> directly (with an optional validator
    closure) for anything else.
  </p>

  <CodeBlock code={schemaApi} lang="rust" />

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '.require(path, type) / .require_with(path, type, f)', d: 'Declare a required field, optionally with a custom validator closure over the DixValue.' },
          { m: '.require_string/int/long/float/double/bool/array/object/enum(path)', d: 'Typed shorthands for .require().' },
          { m: '.optional(path, type) / .optional_with(path, type, f)', d: 'Same as require, but absence is not an error.' },
          { m: '.optional_string/int/long/float/double/bool/array/object(path)', d: 'Typed shorthands for .optional().' },
          { m: '.with_description(text)',   d: 'Attach a description to the schema for tooling/error output.' },
          { m: '.field_count() / .paths()', d: 'Introspect the declared schema.' },
          { m: '.validate(&data)',          d: 'Run validation — returns ValidationReport.' },
          { m: 'data.validate_schema(schema)', d: 'Same as .validate(), called from the DixData side instead.' },
          { m: 'report.is_valid()',         d: 'True if every required field matched and no type mismatches occurred.' },
          { m: 'report.error_count()',      d: 'Total validation errors.' },
          { m: 'report.errors_of_kind(kind)', d: 'Filter errors by ValidationErrorKind.' },
          { m: 'report.failed_paths()',     d: 'Paths that failed validation.' },
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
