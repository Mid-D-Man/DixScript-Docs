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
</div>
