<!-- src/lib/components/docs/sections/csharp/DocCSharpBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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
  <CodeBlock code={builderApi} lang="csharp" />
</div>
