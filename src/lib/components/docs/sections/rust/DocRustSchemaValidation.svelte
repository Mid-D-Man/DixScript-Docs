<!-- src/lib/components/docs/sections/rust/DocRustSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  session_id<long> = 9000000000
  ssl = true

  server:
    port<int> = 8080   // schema below requires > 1024

  enemies:: "Goblin", "Orc", "Dragon"
)

// A file missing 'ssl' or with server.port = 80 would fail the schema
// on the facing page — the compiler itself doesn't know or care about
// that constraint, only SchemaBuilder does, at runtime.`;

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

  <h2>Example .mdix file</h2>
  <p>Passes the schema on this page. Note that <code>require_enum("log_level")</code> would fail against it — there's no <code>log_level</code> field here at all, which is the point: the compiler accepts this file just fine, and only the schema knows it's incomplete.</p>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={schemaApi} lang="rust" />

  <div class="tip-callout">
    <strong>Schema validation vs the compiler</strong>
    <ul>
      <li><strong>Use <code>SchemaBuilder</code></strong> for constraints the DixScript compiler has no way to express — "this field must exist," "this int must be greater than 1024," "this app absolutely requires a <code>ssl</code> flag." Type annotations in the <code>.mdix</code> file itself (<code>port&lt;int&gt;</code>) already enforce <em>type</em> at compile time; schemas add everything past that.</li>
      <li><strong>Validate once, right after loading</strong> — call it immediately after <code>DixLoader::load_text</code>/<code>load_from_str</code> and bail out on failure, rather than scattering <code>data.exists(...)</code> checks through the rest of your code. One validation pass at the boundary means everything downstream can assume the shape is correct.</li>
      <li><strong>Avoid</strong> using <code>require_with</code>'s validator closure for anything expensive or fallible on its own (a network call, a regex compile per validation) — it runs synchronously during <code>.validate()</code> and a panic inside the closure isn't caught, it unwinds straight through.</li>
    </ul>
  </div>

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
