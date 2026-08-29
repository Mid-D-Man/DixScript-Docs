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
</div>
