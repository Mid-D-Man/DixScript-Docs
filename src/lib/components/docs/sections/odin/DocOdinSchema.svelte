<!-- src/lib/components/docs/sections/odin/DocOdinSchema.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const schemaApi = `import "mdix"

s := mdix.schema_new()
defer mdix.schema_destroy(&s)

mdix.schema_require_string(&s, "app_name")
mdix.schema_require_int(&s, "server.port")
mdix.schema_require_bool(&s, "ssl")
mdix.schema_optional_string(&s, "description")

// Generic form for anything beyond the typed require_*/optional_* shorthands:
mdix.schema_require(&s, "custom.path", .Float)

report := mdix.schema_validate(s, db)
defer mdix.validation_report_destroy(&report)

if !mdix.validation_report_is_valid(report) {
    for err in report.errors {
        msg := mdix.validation_error_to_string(err)
        defer delete(msg)
        fmt.println(msg)
    }
}`;
</script>

<div class="doc-page">
  <h1>Schema Validation</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={schemaApi} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'schema_new() / schema_destroy(&s)', d: 'Create / free a schema.' },
          { m: 'schema_require(&s, path, type) / schema_optional(&s, path, type)', d: 'Declare a field with an explicit ffi.Mdix_Type.' },
          { m: 'schema_require_string/int/long/float/double/bool/array/object/enum(&s, path)', d: 'Typed shortcuts for schema_require.' },
          { m: 'schema_optional_string/int/long/float/double/bool(&s, path)', d: 'Typed shortcuts for schema_optional — no array/object/enum shortcut, use schema_optional directly for those.' },
          { m: 'schema_field_count(s)',              d: 'Number of declared fields.' },
          { m: 'schema_validate(s, db)',              d: 'Run validation, returns a report.' },
          { m: 'validation_report_is_valid(report) / validation_report_destroy(&report)', d: 'Overall pass/fail / free the report.' },
          { m: 'validation_error_to_string(err)',     d: 'Render one validation error as a caller-owned string.' },
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
