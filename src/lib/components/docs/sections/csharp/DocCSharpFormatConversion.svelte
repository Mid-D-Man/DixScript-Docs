<!-- src/lib/components/docs/sections/csharp/DocCSharpFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@CONFIG(
  version -> "1.0.0"
)

@DATA(
  name = "MyApp"
  port<int> = 8080
)`;

  const converterApi = `using MidManStudio.Mdix.Core;

using var db = Dix.LoadStr(mdixSource).OrThrow();

MdixResult<string> mdix = Dix.ToMdix(db, MdixFormatMode.Default);  // or .Pretty / .Compact / .Minified
MdixResult<string> json = Dix.ToJson(db, indented: true);
MdixResult<string> toml = Dix.ToToml(db);

MdixResult<string> formatted = Dix.Format(sourceText, MdixFormatMode.Default);
MdixResult<string> minified  = Dix.Minify(sourceText);

// Static equivalents live on MdixConverter too, if you prefer not to go
// through the Dix facade — same methods, same signatures:
MdixConverter.ToJson(db);
MdixResult<MdixDatabase> fromJson = MdixConverter.FromJson(jsonString);
MdixResult<MdixDatabase> fromToml = MdixConverter.FromToml(tomlString);

// Clear the internal type-conversion cache (rarely needed — e.g. after
// hot-reloading many schema shapes in a long-running process)
Dix.ClearSerializerCache();`;
</script>

<div class="doc-page">
  <h1>Format Conversion</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={converterApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Dix facade vs MdixConverter directly</strong>
    <ul>
      <li><strong>Use the <code>Dix</code> facade</strong> in normal application code — it's the same functionality with a shorter name, consistent with <code>Dix.Load</code>/<code>Dix.Merge</code> elsewhere.</li>
      <li><strong>Use <code>MdixConverter</code> directly</strong> when you're writing a library on top of this package and want your public surface to depend on the more specific type rather than the broad <code>Dix</code> facade.</li>
      <li><strong>Avoid <code>ToJson</code> as a save format you plan to <code>Dix.Load</code> back</strong> — JSON has no <code>Long</code>/<code>Date</code>/<code>HexColor</code>/<code>Enum</code> types, so round-tripping through it loses type information that <code>ToMdix</code> preserves exactly. Use JSON for interop outside the DixScript ecosystem, <code>ToMdix</code> for anything you'll load again.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'Dix.ToMdix(db, mode?) / MdixConverter.ToMdix(db, mode?)', d: 'Serialize to .mdix source text.' },
          { m: 'Dix.ToJson(db, indented?) / MdixConverter.ToJson(db, indented?)', d: 'Serialize to a JSON string.' },
          { m: 'Dix.ToToml(db) / MdixConverter.ToToml(db)',              d: 'Serialize to a TOML string.' },
          { m: 'MdixConverter.FromJson(json)',                          d: 'Parse a JSON string into an MdixDatabase.' },
          { m: 'MdixConverter.FromToml(toml)',                          d: 'Parse a TOML string into an MdixDatabase.' },
          { m: 'Dix.Format(source, mode?)',                              d: 'Reformat .mdix source text without loading it into a database.' },
          { m: 'Dix.Minify(source)',                                     d: 'Strip whitespace/comments from source text.' },
          { m: 'Dix.StripComments(source)',                              d: 'Strip comments only — formatting otherwise unchanged.' },
          { m: 'MdixFormatMode.Default/Pretty/Compact/Minified',         d: 'Output style presets.' },
          { m: 'Dix.ClearSerializerCache()',                             d: 'Clear MdixSerializer\'s internal type-conversion cache.' },
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
