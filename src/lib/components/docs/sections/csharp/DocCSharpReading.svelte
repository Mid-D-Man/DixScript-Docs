<!-- src/lib/components/docs/sections/csharp/DocCSharpReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>
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
</div>
