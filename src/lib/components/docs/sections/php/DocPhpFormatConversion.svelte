<!-- src/lib/components/docs/sections/php/DocPhpFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const converterApi = `use MidManStudio\\Mdix\\MdixConverter;

MdixConverter::toJson($db, indented: true);
MdixConverter::toMdix($db, FormatMode::Pretty);
MdixConverter::toToml($db);

MdixConverter::fromJson($jsonStr);
MdixConverter::fromToml($tomlStr);

MdixConverter::formatSource($source, FormatMode::Default);
MdixConverter::minifySource($source);

MdixConverter::jsonRoundTrip($db);   // db -> JSON -> db, useful for deep-cloning

// Railway twins
MdixConverter::tryToJson($db): MdixResult;
MdixConverter::tryFromJson($jsonStr): MdixResult;
MdixConverter::tryFromToml($tomlStr): MdixResult;
MdixConverter::tryFormatSource($source): MdixResult;`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={converterApi} lang="php" />
</div>
