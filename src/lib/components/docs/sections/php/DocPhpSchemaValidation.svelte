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
</div>
