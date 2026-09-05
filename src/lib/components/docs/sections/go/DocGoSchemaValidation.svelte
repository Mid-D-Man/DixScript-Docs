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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'NewSchema()',                     d: 'Start a new, empty schema.' },
          { m: 'Require(path, type) / Optional(path, type)', d: 'Declare a field with an explicit dixscript.ValueType.' },
          { m: 'RequireString/Int/Long/Float/Double/Bool/Array/Object/Enum(path)', d: 'Typed shortcuts for Require.' },
          { m: 'OptionalString/Int/Long/Float/Double/Bool/Array/Object(path)', d: 'Typed shortcuts for Optional.' },
          { m: 'FieldCount() / Paths()',           d: 'Number of declared fields / the list of declared paths.' },
          { m: 'Validate(db)',                     d: 'Run validation, returns a report.' },
          { m: 'report.IsValid() / .ErrorCount() / .FailedPaths()', d: 'Overall pass/fail, error count, and which paths failed.' },
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
