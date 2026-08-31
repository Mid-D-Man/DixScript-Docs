<!-- src/lib/components/docs/sections/csharp/DocCSharpSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  ssl = true

  server:
    port<int> = 8080
)

// Missing 'description' is fine (optional below). A file missing
// 'app_name', 'server.port', or 'ssl' entirely would fail validation
// even though the DixScript compiler accepts it just fine — the
// compiler only enforces the types annotated in the source, not
// "this field must exist at all".`;

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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={schemaApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Schema vs the DixScript compiler</strong>
    <ul>
      <li><strong>Use <code>MdixSchemaBuilder</code></strong> for constraints the compiler can't express — "this field must exist," not just "if present, it must be this type." Type annotations in the source (<code>port&lt;int&gt;</code>) already give you the second part for free.</li>
      <li><strong>Validate immediately after loading</strong>, before anything else reads from the database — same reasoning as every other binding's schema page: one check at the boundary means the rest of your code can assume the shape is correct instead of defensively checking <code>Exists</code> everywhere.</li>
      <li><strong>Use <code>RequireWith&lt;T&gt;</code> for constraints beyond presence and type</strong> — a port number in a valid range, a string matching a format — rather than validating those separately after a plain <code>RequireInt</code> passes.</li>
      <li><strong>Avoid</strong> calling <code>db.Validate(schema)</code> and <code>schema.Validate(db)</code> interchangeably in the same codebase — they're identical, but picking one consistently makes it obvious at a glance whether a given call site is schema-first or database-first thinking.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '.Require<T>(path) / .RequireWith<T>(path, validator)', d: 'Declare a required field, optionally with a custom Func<T, bool> validator.' },
          { m: '.RequireString/Int/Long/Float/Double/Bool(path)',    d: 'Typed shorthands for .Require<T>().' },
          { m: '.Optional<T>(path) / .OptionalWith<T>(path, validator)', d: 'Same as Require, but absence is not an error.' },
          { m: '.OptionalString/Int/Long/Float/Double/Bool(path)',   d: 'Typed shorthands for .Optional<T>().' },
          { m: '.Validate(db)',                                       d: 'Run validation — returns MdixValidationReport.' },
          { m: 'db.Validate(schema)',                                 d: 'Same as .Validate(), called from the database side instead.' },
          { m: 'report.IsValid',                                      d: 'bool — true when Errors is empty.' },
          { m: 'report.Errors',                                       d: 'IReadOnlyList<MdixValidationError> — each has .Path, .Expected, .Actual.' },
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
