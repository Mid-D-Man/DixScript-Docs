<!-- src/lib/components/docs/sections/php/DocPhpReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `$db->exists('server.host');            // bool
$db->valueTypeAt('server.port');       // ValueType enum
$db->arrayLength('enemies');           // int
$db->keys(prefix: '');                 // string[]

$db->getString('server.host', default: null);
$db->getInt('server.port', default: null);
$db->getFloat('ratio', default: null);
$db->getDouble('pi', default: null);
$db->getBool('debug', default: null);
$db->getJson('server');                // raw JSON string of a nested object/array

$db->getEnumName('log_level');         // "LogLevel"
$db->getEnumField('log_level');        // "INFO"
$db->getEnumValue('log_level');        // resolved int

// try* twins — return MdixResult instead of throwing
$db->tryGetString('server.host'): MdixResult;
$db->tryGetInt('server.port'): MdixResult;
$db->tryGetFloat('ratio'): MdixResult;
$db->tryGetDouble('pi'): MdixResult;
$db->tryGetBool('debug'): MdixResult;
$db->tryGetJson('server'): MdixResult;

// Export
$db->toJson(indented: true);
$db->toMdix(FormatMode::Default);
$db->toToml();
(string) $db;   // __toString() -> same as toMdix()`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={readApi} lang="php" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'exists(path)',                     d: 'True if a value exists at path.' },
          { m: 'valueTypeAt(path)',                 d: 'The stored type as a ValueType enum.' },
          { m: 'arrayLength(path)',                 d: 'Number of elements at an array path.' },
          { m: 'keys(prefix) / getAllKeys()',       d: 'Direct child keys under prefix, or every leaf path recursively.' },
          { m: 'getString/Int/Long/Float/Double/Bool(path, default = null)', d: 'Typed getters, default returned instead of throwing when missing.' },
          { m: 'getJson(path)',                     d: 'Raw JSON string of a nested object/array at path.' },
          { m: 'getEnumName/getEnumField/getEnumValue(path)', d: 'Enum type name / field name / resolved integer value.' },
          { m: 'tryGet*(path)',                     d: 'Railway twin of every getter above — returns MdixResult instead of throwing.' },
          { m: 'toJson/toMdix/toToml()',            d: 'Export the whole database as source text.' },
          { m: '__toString()',                      d: 'Same as toMdix() — lets you use $db directly as a string.' },
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
