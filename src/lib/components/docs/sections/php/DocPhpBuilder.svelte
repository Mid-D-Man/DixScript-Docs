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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixBuilder() / fromHandle(db)',  d: 'Create empty, or pre-populate from an already-loaded database for round-trip editing.' },
          { m: 'setString/Int/Long/Float/Double/Bool/Date/Timestamp(path, v)', d: 'Set a flat property — fluent, returns $this.' },
          { m: 'hasKey(path) / remove(path)',          d: 'Check for, or remove, a previously-set property.' },
          { m: 'getString/Int/Long/Float/Double/Bool(path)', d: 'Read back a value already staged on the builder.' },
          { m: 'clear()',                              d: 'Reset the builder to empty, returns $this.' },
          { m: 'saveToFile(path)',                     d: 'Write the built source directly to a file.' },
          { m: 'toMdixString()',                       d: 'Produce the raw .mdix source string.' },
          { m: 'toDatabase() / tryToDatabase()',       d: 'Parse the built source into a Database — throwing, or MdixResult.' },
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
