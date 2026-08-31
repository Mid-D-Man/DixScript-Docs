<!-- src/lib/components/docs/sections/csharp/DocCSharpPoco.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  server:
    host = "api.example.com"
    api_port<int> = 443
    ssl  = true

  admin:
    email       = "root@example.com"
    permissions:: "read", "write", "delete"
)`;

  const basicApi = `public class ServerConfig
{
    public string Host { get; set; } = "";
    public int Port { get; set; }
    public bool Ssl { get; set; }
}

// Deserialize a POCO from a prefix within the loaded data
MdixResult<ServerConfig> cfg = db.Deserialize<ServerConfig>("server");

// Or in one call straight from a file path
MdixResult<ServerConfig> cfg2 = Dix.Deserialize<ServerConfig>("config.mdix", "server");
MdixResult<ServerConfig> cfg3 = Dix.DeserializeFrom<ServerConfig>(db, "server");

// The reverse direction — write a POCO's fields into a builder at a prefix
var builder = new MdixBuilder();
builder.Serialize(new ServerConfig { Host = "localhost", Port = 8080 }, prefix: "server");`;

  const attributesApi = `using MidManStudio.Mdix.Core;

// [MdixObject] — optional class-level prefix, so Deserialize<T>() without
// an explicit prefix argument still knows where to read from
[MdixObject("server")]
public class ServerConfig
{
    // [MdixProperty] — map to a differently-named or nested .mdix path.
    // "Port" alone would look for "server.Port" (case-sensitive by
    // default); the data above has "api_port" instead.
    [MdixProperty("api_port")]
    public int Port { get; set; }

    // [MdixAlias] — try these paths, in order, if the primary name isn't
    // found. AllowMultiple = true, so stack as many as you need for a
    // config that's been renamed across versions.
    [MdixAlias("hostname")]
    [MdixAlias("Host")]
    public string Host { get; set; } = "";

    public bool Ssl { get; set; }

    // [MdixIgnore] — never read from or written to .mdix data at all,
    // regardless of what the data contains.
    [MdixIgnore]
    public string ComputedDisplayName => $"{Host} ({(Ssl ? "https" : "http")})";

    // [MdixRequired] — deserialization fails with a clear error instead
    // of silently leaving the C# default (0 / null / false) if this path
    // is missing from the source data.
    [MdixRequired]
    public string Email { get; set; } = "";

    // [MdixDefaultValue] — an explicit fallback distinct from bare C#
    // defaults, e.g. -1 to mean "not configured" rather than 0 meaning
    // "configured as zero".
    [MdixDefaultValue(-1)]
    public int RetryCount { get; set; }

    // [MdixTransform] — run the raw deserialized value through a static
    // method before it's assigned. Here: normalize a permissions array
    // that arrives lowercase into an enum flag set.
    [MdixTransform(typeof(ServerConfig), nameof(NormalizePermissions))]
    public Permissions Permissions { get; set; }

    public static object NormalizePermissions(object raw)
    {
        var list = (IEnumerable<string>)raw;
        return list.Aggregate(Permissions.None,
            (acc, p) => acc | Enum.Parse<Permissions>(p, ignoreCase: true));
    }

    // [MdixValidation] — reject the whole deserialization if this fails,
    // after the value is set but before Deserialize<T>() returns success.
    [MdixValidation(typeof(ServerConfig), nameof(IsValidPort))]
    public int ValidatedApiPort => Port;

    public static bool IsValidPort(object value) => (int)value is > 0 and < 65536;

    // [MdixConvert] — per-property strictness for type coercion.
    // Strict: exact type match only. Safe (default): reasonable widening
    // (int -> long, "true" -> bool). Forced: try much harder, throwing
    // only if truly impossible.
    [MdixConvert(MdixConversionMode.Strict)]
    public double PreciseRatio { get; set; }
}

[Flags]
public enum Permissions { None = 0, Read = 1, Write = 2, Delete = 4 }`;

  const constructorApi = `// [MdixConstructor] — for immutable POCOs (records, readonly fields):
// mark which constructor to populate from matched .mdix fields when a
// type has more than one and the serializer can't otherwise guess.
public class ImmutableConfig
{
    public string Host { get; }
    public int Port { get; }

    [MdixConstructor]
    public ImmutableConfig(string host, int port)
    {
        Host = host;
        Port = port;
    }

    // A second constructor here is exactly why the attribute is needed —
    // without it, which one gets called is ambiguous.
    public ImmutableConfig() : this("localhost", 8080) { }
}`;
</script>

<div class="doc-page">
  <h1>POCO Deserialization</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. Deserialize
    a <code>.mdix</code> section straight into your own class or struct.
    The bare form below covers the common case; a full attribute set —
    <code>[MdixObject]</code>, <code>[MdixProperty]</code>,
    <code>[MdixAlias]</code>, <code>[MdixIgnore]</code>,
    <code>[MdixRequired]</code>, <code>[MdixDefaultValue]</code>,
    <code>[MdixTransform]</code>, <code>[MdixValidation]</code>,
    <code>[MdixConstructor]</code>, and <code>[MdixConvert]</code> — handles
    everything past that.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <h2>Basic usage</h2>
  <CodeBlock code={basicApi} lang="csharp" />

  <h2>The full attribute set</h2>
  <p>
    Every attribute below is optional and independent — use only the ones
    a given property actually needs. All are applied to properties except
    <code>[MdixObject]</code> (class-level) and <code>[MdixConstructor]</code>
    (constructor-level, see further down).
  </p>
  <CodeBlock code={attributesApi} lang="csharp" />

  <h3>Immutable types — [MdixConstructor]</h3>
  <CodeBlock code={constructorApi} lang="csharp" />

  <div class="tip-callout">
    <strong>When to reach for the attributes</strong>
    <ul>
      <li><strong>Start with the bare form</strong> — plain properties whose names match the <code>.mdix</code> paths exactly need no attributes at all. Add them one at a time only once a real mismatch or requirement shows up.</li>
      <li><strong>Use <code>[MdixRequired]</code> on anything that must be present</strong> for the app to function — it turns a silent zero-value into a clear deserialization failure at the boundary, the same argument as validating a schema right after loading.</li>
      <li><strong>Use <code>[MdixTransform]</code> for real conversions, not formatting</strong> — normalizing an enum, parsing a compound string into a value object. If you're just reformatting a string for display, do that in a property getter instead; a transform runs on every deserialization, a getter runs when you actually need the display value.</li>
      <li><strong>Avoid <code>[MdixConvert(Forced)]</code> as a default habit</strong> — reach for it only on a specific property where you've hit a real, understood mismatch (e.g. a config that sometimes ships numbers as strings). Applying it broadly just to make errors go away hides genuine data problems instead of surfacing them.</li>
    </ul>
  </div>

  <h2>Attribute Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Attribute</th><th>Target</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { a: '[MdixObject(prefix?)]',       t: 'Class/struct',          d: 'Default prefix for Deserialize<T>() calls that don\'t pass one explicitly.' },
          { a: '[MdixProperty(path)]',        t: 'Property/parameter',    d: 'Map to a specific .mdix path instead of the property name.' },
          { a: '[MdixAlias(path)]',           t: 'Property (repeatable)', d: 'Fallback path(s) to try if the primary name isn\'t found. Stack multiple.' },
          { a: '[MdixIgnore]',                t: 'Property',              d: 'Never read from or written to .mdix data.' },
          { a: '[MdixRequired]',              t: 'Property/parameter',    d: 'Fail deserialization with a clear error if this path is missing, instead of leaving the C# default.' },
          { a: '[MdixDefaultValue(value)]',   t: 'Property',              d: 'Explicit fallback when the path is missing, distinct from the bare C# default.' },
          { a: '[MdixTransform(type, method)]', t: 'Property',            d: 'Run the raw value through a public static method before assignment. Method signature: object -> object.' },
          { a: '[MdixValidation(type, method)]', t: 'Property',           d: 'Reject the whole deserialization if a public static method returns false for this value. Method signature: object -> bool.' },
          { a: '[MdixConstructor]',           t: 'Constructor',           d: 'Which constructor to populate when a type has more than one and it\'s otherwise ambiguous.' },
          { a: '[MdixConvert(mode)]',         t: 'Property',              d: 'Per-property type-coercion strictness: Strict, Safe (default), or Forced.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.a}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.75rem">{row.t}</td>
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
