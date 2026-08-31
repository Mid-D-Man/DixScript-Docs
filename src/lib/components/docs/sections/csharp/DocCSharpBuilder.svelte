<!-- src/lib/components/docs/sections/csharp/DocCSharpBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const equivalentMdix = `@CONFIG(
  version  -> "1.0.0"
  author   -> "MidManStudio"
  features -> "advanced"
)

@ENUMS(
  LogLevel { DEBUG, INFO, WARN, ERROR }
  Status   { ACTIVE = 1, INACTIVE = 0 }
)

@DATA(
  app_name = "MyGame"
  port<int> = 8080
  ssl = true

  server:
    host = "localhost"
    port<int> = 8080

  enemies::
    { name = "Goblin", hp<int> = 50  },
    { name = "Orc",    hp<int> = 100 }
)`;

  const builderApi = `using var builder = Dix.Builder();

builder
    .Config(c => c
        .WithVersion("1.0.0")
        .WithAuthor("MidManStudio")
        .WithFeatures("advanced"))
    .Enums(e => e
        .WithEnum("LogLevel", "DEBUG", "INFO", "WARN", "ERROR")
        .WithEnum("Status", ("ACTIVE", 1), ("INACTIVE", 0)))
    .Data(d => d
        // Tier 1 — flat properties first
        .WithString("app_name", "MyGame")
        .WithInt("port", 8080)
        .WithBool("ssl", true)
        // Tier 2 — grouped, after all flat properties
        .WithTableProperties("server", t => t
            .WithString("host", "localhost")
            .WithInt("port", 8080))
        .WithGroupArray("enemies", a => a
            .AddValue(new { name = "Goblin", hp = 50 })
            .AddValue(new { name = "Orc",    hp = 100 })));

MdixResult<MdixDatabase> db = builder.ToDatabase();
MdixResult<string> source   = builder.Serialize();
MdixResult<Unit> saved      = builder.Save("profile.mdix");
var savedAsync              = await builder.SaveAsync("profile.mdix", ct);

// Serialize an existing object into the builder directly
MdixResult<Unit> ok = builder.Serialize(myServerConfigInstance, prefix: "server");

// Round-trip an existing database back into a builder to modify it
MdixResult<MdixBuilder> fromExisting = MdixBuilder.FromDatabase(db);`;
</script>

<div class="doc-page">
  <h1>MdixBuilder — Building Programmatically</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. The fluent
    builder enforces the same two-tier <code>@DATA</code> rule as every
    other binding: flat properties before table properties or group
    arrays.
  </p>

  <h2>Equivalent .mdix source</h2>
  <p>The builder call below produces the same data as compiling this file would.</p>
  <CodeBlock code={equivalentMdix} lang="dixscript" />

  <CodeBlock code={builderApi} lang="csharp" />

  <div class="tip-callout">
    <strong>Builder vs Serialize&lt;T&gt; vs writing .mdix by hand</strong>
    <ul>
      <li><strong>Use the fluent builder</strong> when you're assembling data field-by-field from several different sources — a mix of hardcoded values, config, and computed values in one place.</li>
      <li><strong>Use <code>builder.Serialize(obj, prefix)</code></strong> when you already have an object shaped like the section you want to write — one call replaces a whole block of <code>.With*()</code> calls, and it's the exact write-side mirror of <a href="#csharp-api--poco">POCO deserialization</a>'s attributes.</li>
      <li><strong>Write <code>.mdix</code> by hand</strong> for anything static that a human edits directly — same guidance as every other language's builder page: comments, LSP support, and syntax highlighting only exist for real source files.</li>
      <li><strong>Avoid</strong> calling <code>ToDatabase()</code> and then immediately <code>Save()</code>-ing that database back to the same path you started from as a save-config pattern — <code>builder.Save(path)</code> already writes the builder's own state directly; going through an intermediate <code>MdixDatabase</code> first only costs an extra round-trip.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'Dix.Builder()',                        d: 'Create a new MdixBuilder.' },
          { m: '.Config(c => { … })',                  d: 'Configure @CONFIG metadata: WithVersion, WithAuthor, WithFeatures.' },
          { m: '.Enums(e => { … })',                   d: 'Declare @ENUMS: WithEnum(name, ...fields) or WithEnum(name, ...(field, value) pairs).' },
          { m: '.Data(d => { … })',                    d: 'Configure @DATA. Flat properties first (With*), then tables/arrays.' },
          { m: 'd.WithTableProperties(path, t => { … })', d: 'Add a table block.' },
          { m: 'd.WithGroupArray(path, a => { … })',   d: 'Add a group array. a.AddValue(obj) per element.' },
          { m: '.ToDatabase()',                         d: 'Consume the builder, produce an MdixDatabase in memory.' },
          { m: '.Serialize()',                          d: 'Consume the builder, produce the raw .mdix source string.' },
          { m: '.Serialize<T>(obj, prefix?)',           d: 'Write an object\'s fields into the builder at prefix, honoring MdixSerializer attributes.' },
          { m: '.Save(path) / .SaveAsync(path, ct)',    d: 'Write the builder\'s current state to a .mdix file.' },
          { m: 'MdixBuilder.FromDatabase(db)',          d: 'Start a builder pre-populated from an already-loaded MdixDatabase, to modify and re-save it.' },
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
