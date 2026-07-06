<!-- src/lib/components/docs/sections/DocCSharpApi.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `<!-- .csproj -->
<PackageReference Include="MidManStudio.Mdix.Core" Version="*" />

<!-- NuGet packaging is still pending — until then, reference the project
     directly from a clone of DixScript-Rust: -->
<ProjectReference Include="../DixScript-Rust/mdix-csharp/src/MidManStudio.Mdix.Core/MidManStudio.Mdix.Core.csproj" />`;

  const quickStart = `using MidManStudio.Mdix;

// Dix is the static one-liner facade — the primary entry point
var result = Dix.Load("config.mdix");

if (result.IsFailure)
{
    Console.WriteLine($"Load failed: {result.Error}");
    return;
}

using var db = result.SuccessResult; // MdixDatabase implements IDisposable

int  port  = db.GetInt("server.port").OrThrow();
string host = db.GetString("server.host").UnwrapOr("localhost");
bool  debug = db.GetBool("debug").UnwrapOr(false);

Console.WriteLine($"{host}:{port} debug={debug}");`;

  const mdixResult = `// Every fallible operation returns MdixResult<T> instead of throwing.
MdixResult<int> portResult = db.GetInt("server.port");

if (portResult.IsSuccess)
{
    int port = portResult.SuccessResult;
}
else
{
    MdixError error = portResult.Error;     // .Kind, .Message, .Path, .InnerException
}

// Terminal operations
int a = portResult.OrThrow();                       // throws MdixException on failure
int b = portResult.Unwrap();                         // alias for OrThrow()
int c = portResult.UnwrapOr(8080);                    // fallback value
int d = portResult.UnwrapOrElse(err => 8080);         // fallback factory

// Pattern matching
portResult.Match(
    onSuccess: p => Console.WriteLine($"port={p}"),
    onFailure: e => Console.WriteLine($"error={e.Kind}"));

string label = portResult.Match(
    onSuccess: p => $"port {p}",
    onFailure: e => $"failed: {e.Message}");

// Functional chaining
MdixResult<string> asString = portResult.Map(p => p.ToString());
MdixResult<int> doubled = portResult.AndThen(p =>
    p > 0 ? MdixResult<int>.Ok(p * 2) : MdixResult<int>.Err(MdixError.InvalidPath("port")));

// MdixErrorKind: NotFound, TypeMismatch, NullHandle, InvalidPath,
// NativeError, IoError, ParseError, SchemaError, Disposed`;

  const loadingApi = `using MidManStudio.Mdix;
using MidManStudio.Mdix.Core;

// Sync
Dix.Load(path);
Dix.LoadStr(source);
Dix.LoadEncrypted(encPath, keyPath: null);
Dix.LoadEncryptedPassword(encPath, password);
Dix.LoadEncryptedBytes(bytes, keyContent, password: null);
Dix.LoadEncryptedWith(encPath, new MdixLoadOptions { /* ... */ });

// Async — same names, +Async, take a CancellationToken
await Dix.LoadAsync(path, ct);
await Dix.LoadStrAsync(source, ct);
await Dix.LoadEncryptedAsync(encPath, keyPath, ct);
await Dix.LoadEncryptedPasswordAsync(encPath, password, ct);
await Dix.LoadEncryptedBytesAsync(bytes, keyContent, password, ct);

// Foreign formats
Dix.LoadJson(jsonString);
Dix.LoadToml(tomlString);

// Hot reload — re-read the same source path on demand
db.EnableHotReload();
// ... later, after the file on disk has changed:
MdixResult<MdixDatabase> reloaded = db.Reload();
var reloadedAsync = await db.ReloadAsync(ct);
db.DisableHotReload();`;

  const readApi = `MdixResult<string> name  = db.GetString("app_name");
MdixResult<int>    port  = db.GetInt("server.port");
MdixResult<long>   sid   = db.GetLong("session_id");
MdixResult<float>  ratio = db.GetFloat("ratio");
MdixResult<double> pi    = db.GetDouble("pi");
MdixResult<bool>   debug = db.GetBool("debug");
MdixResult<string> raw   = db.GetJson("server");   // nested object/array as raw JSON

// Special types
MdixResult<MdixHexColor>  color = db.GetHexColor("brand");
MdixResult<MdixBlob>      blob  = db.GetBlob("icon");
MdixResult<MdixRegex>     re    = db.GetRegex("pattern");
MdixResult<MdixDate>      date  = db.GetDate("release");
MdixResult<MdixTimestamp> ts    = db.GetTimestamp("created_at");

// Enums
MdixResult<string> enumName  = db.GetEnumName("log_level");   // "LogLevel"
MdixResult<string> enumField = db.GetEnumField("log_level");  // "INFO"
MdixResult<int>    enumValue = db.GetEnumValue("log_level");  // resolved int

// Generic — works for any T with a registered conversion
MdixResult<T> Get<T>(string path);

// Collections
MdixResult<List<T>> GetArray<T>(string path);            // typed array at a path
MdixResult<List<T>> GetAll<T>(string? prefix = null);     // select_many-style wildcard collection
MdixResult<(T1, T2)> GetTuple<T1, T2>(string path);       // up to 6 type params, mirrors t:() arity

// Introspection
bool Exists(string path);
MdixValueType GetValueType(string path);
MdixResult<int> GetArrayLength(string path);
MdixResult<string[]> GetKeys(string? prefix = null);`;

  const queryApi = `using MidManStudio.Mdix.Core;

// LINQ-style extension methods over a loaded MdixDatabase — for querying
// group arrays without writing GetArray<T>() + manual LINQ every time.

db.QueryFirst<Enemy>("enemies");
db.QueryFirst<Enemy>("enemies", e => e.Hp > 100);
db.QueryLast<Enemy>("enemies");
db.QuerySingle<Enemy>("enemies", e => e.Name == "Boss");   // errors if 0 or >1 match

db.QueryWhere<Enemy>("enemies", e => e.Hp > 50);
db.QuerySelect<Enemy, string>("enemies", e => e.Name);

db.QueryCount<Enemy>("enemies");
db.QueryAny<Enemy>("enemies", e => e.Hp > 400);
db.QueryAll<Enemy>("enemies", e => e.Hp > 0);

db.QueryOrderBy<Enemy, int>("enemies", e => e.Hp);
db.QueryOrderByDescending<Enemy, int>("enemies", e => e.Hp);
db.QueryDistinct<string>("tags");

db.QueryTake<Enemy>("enemies", 3);
db.QuerySkip<Enemy>("enemies", 3);

// Every Query* method returns MdixResult<T> / MdixResult<List<T>> —
// same error-handling story as the rest of the API.`;

  const dynamicApi = `// AsDynamic() gives you dynamic member + index access when you don't
// want to declare a POCO for a one-off read.
dynamic cfg = db.AsDynamic();

string host = cfg.server.host;
int    port = cfg.server.port;
string firstEnemyName = cfg.enemies[0].name;

MdixResult<string> json = ((MdixDynamic)cfg).ToJson();`;

  const deserializeApi = `public class ServerConfig
{
    public string Host { get; set; } = "";
    public int Port { get; set; }
    public bool Ssl { get; set; }
}

// Deserialize a POCO from a prefix within the loaded data
MdixResult<ServerConfig> cfg = db.Deserialize<ServerConfig>("server");

// Or in one call straight from a file path
MdixResult<ServerConfig> cfg2 = Dix.Deserialize<ServerConfig>("config.mdix", "server");
MdixResult<ServerConfig> cfg3 = Dix.DeserializeFrom<ServerConfig>(db, "server");`;

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

  const mergeApi = `using MidManStudio.Mdix.Core;

// Two databases
MdixResult<MdixDatabase> merged = Dix.Merge(baseDb, overlayDb,
    MdixMergeStrategy.PrimaryWins);   // or SecondaryWins / etc.

// Any number, left to right
MdixResult<MdixDatabase> combined = Dix.MergeAll(
    new[] { baseDb, envDb, localOverridesDb },
    MdixMergeStrategy.PrimaryWins);

// Merge a raw JSON object into an existing database
MdixResult<MdixDatabase> withJson = Dix.MergeJson(baseDb, jsonOverlayString);

// Async variants exist for both
var mergedAsync = await Dix.MergeAsync(baseDb, overlayDb);
var combinedAsync = await Dix.MergeAllAsync(new[] { baseDb, envDb });

// Neither input is modified or disposed — Merge/MergeAll always
// return a new MdixDatabase.`;

  const schemaApi = `using MidManStudio.Mdix.Core;

var schema = new MdixSchemaBuilder()
    .RequireString("app_name")
    .RequireInt("server.port")
    .RequireBool("ssl")
    .OptionalString("description")
    .OptionalInt("timeout");

MdixValidationReport report = schema.Validate(db);

if (!report.IsValid)
{
    foreach (var err in report.Errors)
        Console.WriteLine($"{err.Path}: expected {err.Expected}, got {err.Actual}");
}

// Or inline via the database itself
MdixValidationReport report2 = db.Validate(schema);

// Require<T> / Optional<T> / RequireWith<T> / OptionalWith<T> also exist
// for generic and custom-validator field declarations beyond the typed
// RequireString/RequireInt/... shorthands shown above.`;

  const converterApi = `using MidManStudio.Mdix.Core;

MdixResult<string> mdix = Dix.ToMdix(db, MdixFormatMode.Default);  // or .Pretty / .Compact / .Minified
MdixResult<string> json = Dix.ToJson(db, indented: true);
MdixResult<string> toml = Dix.ToToml(db);

MdixResult<string> formatted = Dix.Format(sourceText, MdixFormatMode.Default);
MdixResult<string> minified  = Dix.Minify(sourceText);

// Static equivalents live on MdixConverter too, if you prefer not to go
// through the Dix facade:
MdixConverter.ToJson(db);
MdixConverter.FromJson(jsonString);

// Clear the internal type-conversion cache (rarely needed — e.g. after
// hot-reloading many schema shapes in a long-running process)
Dix.ClearSerializerCache();`;
</script>

<div class="doc-page">
  <h1>C# / Unity Runtime API</h1>
  <p class="page-lead">
    <code>MidManStudio.Mdix.Core</code> is the most complete language
    binding — it was the original reference implementation before the Rust
    port, and the C# wrapper around the Rust core has grown well past a
    thin FFI shim: LINQ-style queries, dynamic access, POCO
    (de)serialization, schema validation, database merging, hot reload, and
    a full async surface are all here. NuGet packaging is still pending —
    reference the project directly until then.
  </p>

  <h2>Install</h2>
  <CodeBlock code={install} lang="markup" />

  <h2>Quick Start</h2>
  <CodeBlock code={quickStart} lang="csharp" />

  <h2>MdixResult&lt;T&gt; — Error Handling</h2>
  <p>
    Nothing in this API throws by default. Every fallible call returns
    <code>MdixResult&lt;T&gt;</code>, a discriminated success/failure wrapper
    with functional combinators — the same shape used throughout every
    other language binding, just C#-flavoured.
  </p>
  <CodeBlock code={mdixResult} lang="csharp" />

  <h2>Loading — Sync, Async &amp; Hot Reload</h2>
  <CodeBlock code={loadingApi} lang="csharp" />

  <h2>Reading Values</h2>
  <CodeBlock code={readApi} lang="csharp" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'db.Exists(path)',            d: 'True if the dotted path is present.' },
          { m: 'db.GetValueType(path)',       d: 'Returns the MdixValueType enum at a path.' },
          { m: 'db.GetArrayLength(path)',     d: 'Element count of an array/group-array at path.' },
          { m: 'db.GetKeys(prefix)',          d: 'Direct child key names. Omit prefix for top-level keys.' },
          { m: 'db.GetArray<T>(path)',        d: 'Typed List<T> of a homogeneous array.' },
          { m: 'db.GetAll<T>(prefix)',        d: 'Wildcard collection — equivalent to select_many across a prefix.' },
          { m: 'db.GetTuple<T1..T6>(path)',   d: 'Typed tuple read — arity must match the t:() literal.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Query — LINQ Over Group Arrays</h2>
  <p>
    <code>MdixQuery</code> extension methods let you filter, project, and
    aggregate a group array at a path without hand-rolling
    <code>GetArray&lt;T&gt;(path)</code> + LINQ every time.
  </p>
  <CodeBlock code={queryApi} lang="csharp" />

  <h2>Dynamic Access</h2>
  <p>
    <code>MdixDynamic</code> implements <code>DynamicObject</code> for quick
    exploratory reads — property and index access resolve against the
    underlying <code>DixData</code> at runtime. Prefer typed
    <code>Get&lt;T&gt;</code>/<code>Deserialize&lt;T&gt;</code> for anything
    that ships to production; <code>dynamic</code> loses compile-time safety.
  </p>
  <CodeBlock code={dynamicApi} lang="csharp" />

  <h2>POCO Deserialization</h2>
  <CodeBlock code={deserializeApi} lang="csharp" />

  <h2>MdixBuilder — Building Programmatically</h2>
  <p>
    The fluent builder enforces the same two-tier <code>@DATA</code> rule
    as every other binding: flat properties before table properties or
    group arrays.
  </p>
  <CodeBlock code={builderApi} lang="csharp" />

  <h2>Merging Databases</h2>
  <CodeBlock code={mergeApi} lang="csharp" />

  <h2>Schema Validation</h2>
  <CodeBlock code={schemaApi} lang="csharp" />

  <h2>Format Conversion</h2>
  <CodeBlock code={converterApi} lang="csharp" />

  <h2>Dix Facade — Full Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Methods</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'Load, LoadStr, LoadEncrypted, LoadEncryptedPassword, LoadEncryptedBytes, LoadEncryptedWith — each with an *Async twin' },
          { c: 'Foreign in',  d: 'LoadJson, LoadToml' },
          { c: 'Merge',       d: 'Merge, MergeAll, MergeJson — each with an *Async twin' },
          { c: 'Deserialize', d: 'Deserialize<T>(path, prefix), DeserializeFrom<T>(db, prefix)' },
          { c: 'Build',       d: 'Builder(), BuilderFrom(db)' },
          { c: 'Convert',     d: 'ToMdix, ToJson, ToToml, Format, Minify' },
          { c: 'Cache',       d: 'ClearSerializerCache()' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.c}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
