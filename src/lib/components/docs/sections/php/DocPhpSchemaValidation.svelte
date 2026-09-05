<!-- src/lib/components/docs/sections/php/DocPhpSchemaValidation.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const schemaPhp = `use MidManStudio\\Mdix\\MdixSchemaBuilder;

$schema = (new MdixSchemaBuilder())
    ->requireString('host')
    ->requireInt('port')
    ->optionalBool('debug')
    ->requireArray('enemies')
    ->withDescription('Server config schema');

$report = $schema->validate($db);

if (!$report->isValid()) {
    foreach ($report->failedPaths() as $path) {
        echo "invalid: {$path}\\n";
    }
    // errorsOfKind(ValidationErrorKind::Missing) etc. filters to one kind
}`;
</script>

<div class="doc-page">
  <h1>Schema Validation</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. Declarative
    required/optional field validation against an already-loaded
    <code>MdixDatabase</code>, independent of the syntax-only checking
    <code>mdix validate</code> (the CLI) does.
  </p>

  <CodeBlock code={schemaPhp} lang="php" />

  <p>
    Every <code>require*</code>/<code>optional*</code> typed shortcut
    (<code>String</code>, <code>Int</code>, <code>Long</code>,
    <code>Float</code>, <code>Double</code>, <code>Bool</code>,
    <code>Array</code>, <code>Object</code>, <code>Enum</code>) is sugar over
    <code>require($path, $type)</code>/<code>optional($path, $type)</code>
    with an <code>ExpectedType</code> enum case. <code>requireWith</code>/
    <code>optionalWith</code> take an extra <code>callable</code> validator
    for checks beyond type presence — a range check, a regex, anything
    <code>MdixDatabase</code>'s own getters can't express on their own.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixSchemaBuilder()',           d: 'Start a new, empty schema.' },
          { m: 'require($path, $type) / requireWith($path, $type, $validator)', d: 'Declare a required field, optionally with an extra validator callback.' },
          { m: 'requireString/Int/Long/Float/Double/Bool/Array/Object/Enum($path)', d: 'Typed shortcuts for require.' },
          { m: 'optional($path, $type) / optionalWith(...)', d: 'Declare an optional field.' },
          { m: 'optionalString/Int/Long/Float/Double/Bool/Array/Object/Enum($path)', d: 'Typed shortcuts for optional.' },
          { m: 'withDescription($text)',            d: 'Attach a human-readable description to the schema.' },
          { m: 'fieldCount() / paths()',            d: 'Number of declared fields / the list of declared paths.' },
          { m: 'validate($db)',                     d: 'Run validation, returns an MdixValidationReport.' },
          { m: 'Report::isValid() / errorCount() / errorsOfKind() / failedPaths()', d: 'Overall pass/fail, error count, filtered errors, and which paths failed.' },
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
