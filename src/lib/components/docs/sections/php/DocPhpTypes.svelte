<!-- src/lib/components/docs/sections/php/DocPhpTypes.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const valueTypeApi = `use MidManStudio\\Mdix\\ValueType;

// Returned by $db->valueTypeAt($path)
enum ValueType: int {
    case Unknown; case Null; case Bool; case Int; case Float; case Double;
    case String; case Date; case Timestamp; case HexColor; case Blob;
    case Regex; case Array; case Object; case Tuple; case Enum;
}

$type = $db->valueTypeAt('server.port');
$type->label();     // "int" — human-readable
$type->isScalar();  // true for Bool/Int/Float/Double/String only

use MidManStudio\\Mdix\\FormatMode;

// Passed to toMdix() / formatSource()
enum FormatMode: int {
    case Default;   // 2-space indentation
    case Pretty;    // 4-space indentation, sorted keys
    case Compact;   // trailing whitespace removed, blank lines collapsed
    case Minified;  // all unnecessary whitespace stripped
}`;
</script>

<div class="doc-page">
  <h1>Types — ValueType &amp; FormatMode</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>.
    <code>ValueType</code> is what <code>$db-&gt;valueTypeAt($path)</code> returns —
    every discriminant DixScript's runtime value enum can hold.
    <code>FormatMode</code> controls output shape for
    <code>toMdix()</code> / <code>formatSource()</code>.
  </p>
  <CodeBlock code={valueTypeApi} lang="php" />
</div>
