<!-- src/lib/components/docs/sections/python/DocPythonSchema.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const schemaApi = `from midmanstudio.mdix import MdixSchemaBuilder

report = (MdixSchemaBuilder()
          .require_string("name")
          .require_int("port")
          .require_bool("ssl")
          .require_long("session_id")
          .require_array("enemies")
          .require_enum("log_level")
          .optional_bool("debug")
          .optional_string("description")
          .with_description("basic app config")
          .validate(db))

if not report.is_valid:
    for err in report.errors:
        print(f"{err.path}: expected {err.expected}, got {err.actual} ({err.kind})")
    print(report.failed_paths())
    print(report.errors_of_kind("type_mismatch"))

print(bool(report))   # same as report.is_valid`;
</script>

<div class="doc-page">
  <h1>MdixSchemaBuilder — Validation</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={schemaApi} lang="python" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '.require(path, type) / .require_string/int/long/float/double/bool/array/object/enum(path)', d: 'Declare a required field. Typed shorthands for the common cases.' },
          { m: '.optional(path, type) / .optional_string/int/long/float/double/bool/array/object(path)', d: 'Declare an optional field — absence is not an error.' },
          { m: '.with_description(text)',   d: 'Attach a human-readable description to the schema (for tooling/errors).' },
          { m: '.field_count() / .paths()', d: 'Introspect the declared schema itself.' },
          { m: '.validate(db)',             d: 'Run validation, returns MdixValidationReport.' },
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
