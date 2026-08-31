<!-- src/lib/components/docs/sections/csharp/DocCSharpEnumCodeGen.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@ENUMS(
  LogLevel { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }
  Rarity   { COMMON, UNCOMMON, RARE, LEGENDARY }   // auto: 0, 1, 2, 3
)

@DATA(
  log_level = LogLevel.INFO
)`;

  const generatorApi = `using MidManStudio.Mdix.Core;

// From a file on disk
MdixResult<string> generated = MdixEnumCodeGenerator.GenerateFromFile(
    "config.mdix",
    @namespace: "MyGame.Config",
    accessModifier: "public"     // or "internal"
);

// Or straight from source text — no native handle, no decryption key
// needed, since this works at the source-text level rather than going
// through mdix-ffi at all
MdixResult<string> generated2 = MdixEnumCodeGenerator.GenerateFromSource(
    mdixSource, "MyGame.Config", "public"
);

if (generated.IsSuccess)
{
    File.WriteAllText("Generated/DixEnums.cs", generated.SuccessResult);
}

// Produces, for the file above:
//
// namespace MyGame.Config
// {
//     public enum LogLevel { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }
//     public enum Rarity { COMMON, UNCOMMON, RARE, LEGENDARY }
// }`;
</script>

<div class="doc-page">
  <h1>Enum Code Generation</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
    <code>MdixEnumCodeGenerator</code> reads a <code>.mdix</code> file's
    <code>@ENUMS</code> section and writes out real, type-safe C#
    <code>enum</code> declarations — so a property typed as your actual
    <code>LogLevel</code> enum deserializes correctly via
    <a href="#csharp-api--poco">POCO deserialization</a> instead of coming
    back as a raw int you hand-map yourself.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={generatorApi} lang="csharp" />

  <div class="tip-callout">
    <strong>How the numbering stays correct</strong>
    <ul>
      <li>The generator doesn't compute enum values itself — it only records which fields had an explicit <code>= value</code> and which didn't. C#'s own auto-numbering rule (<code>enum E &#123; A, B, C = 5, D &#125;</code> → A=0, B=1, C=5, D=6) is <em>identical</em> to DixScript's, so the C# compiler that later builds the generated file reproduces the exact same numbers DixScript's own resolver would — no arithmetic duplicated here to silently drift out of sync as DixScript's resolver evolves.</li>
      <li>It works at the source-text level, not through <code>mdix-ffi</code> — a single pass to strip comments, then scan for <code>@ENUMS</code>. That means it can generate types from a file that can't currently be <em>loaded</em> for an unrelated reason (a missing decryption key, say), as long as the <code>@ENUMS</code> section itself is well-formed.</li>
      <li>Generated type names match the DixScript enum names exactly, by convention — the same convention <a href="#csharp-api--poco"><code>MdixSerializer</code></a> relies on when serializing an enum-typed property back out (it uses the C# type's own <code>Name</code> as the DixScript enum name). A generated type round-trips through <code>Serialize</code>/<code>Deserialize</code> with no extra wiring.</li>
    </ul>
  </div>

  <div class="tip-callout">
    <strong>When to generate vs hand-write the enum</strong>
    <ul>
      <li><strong>Generate</strong> when the <code>.mdix</code> file is the source of truth and changes independently of your C# code — a designer- or config-owned enum set you don't want silently drifting out of sync with what the data actually contains.</li>
      <li><strong>Hand-write it</strong> when the enum is small, stable, and effectively part of your code's own contract — generating a three-value enum that never changes just adds a build step for no real benefit.</li>
      <li><strong>Avoid</strong> committing the generated file and also running generation in CI without a diff check — the whole point is staying in sync with the <code>.mdix</code> source; a stale committed copy that silently stops matching defeats it.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'GenerateFromFile(path, @namespace?, accessModifier?)',   d: 'Read a .mdix file from disk and generate C# enum source. Defaults: namespace "MidManStudio.Mdix.Generated", accessModifier "public".' },
          { m: 'GenerateFromSource(mdixSource, @namespace?, accessModifier?)', d: 'Same, from raw .mdix source text — no disk access.' },
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
