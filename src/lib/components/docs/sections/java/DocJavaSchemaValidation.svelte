<!-- src/lib/components/docs/sections/java/DocJavaSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const schemaApi = `SchemaBuilder schema = new SchemaBuilder()
    .requireString("app_name")
    .requireInt("server.port")
    .requireBool("ssl")
    .optionalString("description")
    .optionalInt("timeout");

SchemaBuilder.Report report = schema.validate(db);

if (!report.isValid()) {
    for (SchemaBuilder.ValidationError err : report.errors) {
        System.out.println(err.path + ": expected " + err.expected + ", got " + err.actual);
    }
    System.out.println(report.failedPaths());
}

// require(path, type) / requireWith(path, type, validator) accept an
// ExpectedType directly for anything beyond the typed requireString/
// requireInt/... shorthands above. ExpectedType.ANY accepts any value type.`;
</script>

<div class="doc-page">
  <h1>Schema Validation</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.
    <code>SchemaBuilder</code> — fluent, declarative required/optional
    field validation against a loaded <code>Database</code>.
  </p>
  <CodeBlock code={schemaApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new SchemaBuilder()',              d: 'Start a new, empty schema.' },
          { m: 'require(path, type) / requireWith(path, type, validator)', d: 'Declare a required field, optionally with an extra validator callback.' },
          { m: 'requireString/Int/Long/Float/Double/Bool/Array/Object/Enum(path)', d: 'Typed shortcuts for require.' },
          { m: 'optional(path, type) / optionalWith(path, type, validator)', d: 'Declare an optional field.' },
          { m: 'optionalString/Int/Long/Float/Double/Bool/Array/Object/Enum(path)', d: 'Typed shortcuts for optional.' },
          { m: 'withDescription(text)',             d: 'Attach a human-readable description to the schema.' },
          { m: 'fieldCount() / paths()',            d: 'Number of declared fields / the list of declared paths.' },
          { m: 'validate(db)',                      d: 'Run validation, returns a Report.' },
          { m: 'Report.isValid() / .errorCount() / .errorsOfKind(kind) / .failedPaths()', d: 'Overall pass/fail, error count, filtered errors, and which paths failed.' },
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
