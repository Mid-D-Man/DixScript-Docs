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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'toJson($db, indented)',      d: 'Export as a JSON string.' },
          { m: 'toMdix($db, formatMode)',     d: 'Export as .mdix source text.' },
          { m: 'toToml($db)',                d: 'Export as a TOML string.' },
          { m: 'fromJson($json) / fromToml($toml)', d: 'Parse a foreign format string into a new Database.' },
          { m: 'formatSource($src, mode)',    d: 'Reformat raw .mdix source text.' },
          { m: 'minifySource($src)',          d: 'Aggressively shrink raw .mdix source text.' },
          { m: 'jsonRoundTrip($db)',          d: 'Export then re-import through JSON — a cheap way to deep-clone a Database.' },
          { m: 'try* variants',               d: 'Railway twins of every method above — return MdixResult instead of throwing.' },
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
