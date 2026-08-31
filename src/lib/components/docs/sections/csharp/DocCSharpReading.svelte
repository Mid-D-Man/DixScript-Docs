<!-- src/lib/components/docs/sections/csharp/DocCSharpReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@ENUMS(
  LogLevel { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }
)

@DATA(
  app_name = "MyApp"
  session_id<long> = 9000000000
  ratio<float> = 0.75
  pi<double> = 3.14159265
  debug = true
  log_level = LogLevel.INFO
  brand = #2D6A9F

  server:
    port<int> = 8080

  enemies:: "Goblin", "Orc", "Dragon"

  position = t:(10, 20)
)`;

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
MdixResult<List<string>> enemies = db.GetArray<string>("enemies");
MdixResult<List<int>> allPorts   = db.GetAll<int>("services");   // select_many-style wildcard collection
MdixResult<(int, int)> pos       = db.GetTuple<int, int>("position"); // up to 6 type params, mirrors t:() arity

// Introspection
bool Exists(string path);
MdixValueType GetValueType(string path);
MdixResult<int> GetArrayLength(string path);
MdixResult<string[]> GetKeys(string? prefix = null);`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={readApi} lang="csharp" />

  <div class="tip-callout">
    <strong>GetArray vs GetAll vs GetTuple</strong>
    <ul>
      <li><strong>Use <code>GetArray&lt;T&gt;(path)</code></strong> for a single group array at a known path — <code>enemies</code> above.</li>
      <li><strong>Use <code>GetAll&lt;T&gt;(prefix)</code></strong> for the wildcard case — collecting the same field across a set of sibling tables you don't want to enumerate by hand (mirrors <code>select_many</code> in the Rust core).</li>
      <li><strong>Use <code>GetTuple&lt;T1..T6&gt;(path)</code></strong> only for data actually written as a <code>t:(...)</code> literal — its arity must match exactly, so it isn't a substitute for reading a two-element array with <code>GetArray</code>.</li>
      <li><strong>Avoid</strong> calling <code>Get&lt;T&gt;</code> generically when a specific typed getter exists — <code>GetInt</code>/<code>GetString</code>/etc. give clearer compiler errors at the call site and match what every other language binding's docs describe as the primary API; reach for the generic form mainly when <code>T</code> itself is a type parameter you don't know concretely.</li>
    </ul>
  </div>

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
