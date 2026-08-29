<!-- src/lib/components/docs/sections/go/DocGoSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const schemaApi = `schema := dixscript.NewSchema().
    RequireString("app_name").
    RequireInt("server.port").
    RequireBool("ssl").
    OptionalString("description").
    OptionalInt("timeout")

report := schema.Validate(db)

if !report.IsValid() {
    for _, e := range report.Errors {
        fmt.Println(e.Error()) // path, expected type, actual type
    }
    fmt.Println(report.FailedPaths())
}

// Require(path, type) / Optional(path, type) accept a dixscript.ValueType
// directly for anything beyond the typed RequireString/RequireInt/...
// shorthands above.`;
</script>

<div class="doc-page">
  <h1>Schema Validation</h1>
  <p class="page-lead">
    Part of the <a href="#go-api">Go Runtime API</a>.
    <code>SchemaBuilder</code> — fluent, declarative required/optional
    field validation against a loaded <code>*Database</code>.
  </p>
  <CodeBlock code={schemaApi} lang="go" />
</div>
