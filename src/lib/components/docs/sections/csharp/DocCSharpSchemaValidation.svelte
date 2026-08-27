<!-- src/lib/components/docs/sections/csharp/DocCSharpSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const schemaApi = `using MidManStudio.Mdix.Core;

var schema = new MdixSchemaBuilder()
    .RequireString("app_name")
    .RequireInt("server.port")
    .RequireBool("ssl")
    .OptionalString("description")
    .OptionalInt("timeout");

MdixValidationReport report = schema.Validate(db);

if (!report.IsValid)
{
    foreach (var err in report.Errors)
        Console.WriteLine($"{err.Path}: expected {err.Expected}, got {err.Actual}");
}

// Or inline via the database itself
MdixValidationReport report2 = db.Validate(schema);

// Require<T> / Optional<T> / RequireWith<T> / OptionalWith<T> also exist
// for generic and custom-validator field declarations beyond the typed
// RequireString/RequireInt/... shorthands shown above.`;
</script>

<div class="doc-page">
  <h1>Schema Validation</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>
  <CodeBlock code={schemaApi} lang="csharp" />
</div>
