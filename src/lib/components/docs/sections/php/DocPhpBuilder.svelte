<!-- src/lib/components/docs/sections/php/DocPhpBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `use MidManStudio\\Mdix\\MdixBuilder;

$db = (new MdixBuilder())
    ->setString('app_name', 'MyGame')
    ->setInt('port', 8080)
    ->setFloat('ratio', 0.75)
    ->setBool('ssl', true)
    ->setDate('release', new DateTimeImmutable('2025-12-31'))
    ->setTimestamp('created_at', new DateTimeImmutable('now'))
    ->toDatabase();

// Introspect / mutate before finishing
$builder->hasKey('app_name');   // bool
$builder->remove('app_name');   // bool
$builder->clear();              // reset everything, returns self

// Finish
$builder->saveToFile('profile.mdix');
$src = $builder->toMdixString();
$db  = $builder->toDatabase();          // throws on failure
$result = $builder->tryToDatabase();     // MdixResult instead

// Builders also expose typed getters for values already staged in them:
$builder->getString('app_name');
$builder->getInt('port');`;
</script>

<div class="doc-page">
  <h1>Building Programmatically</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={builderApi} lang="php" />
</div>
