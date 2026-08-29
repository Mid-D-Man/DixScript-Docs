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
</div>
