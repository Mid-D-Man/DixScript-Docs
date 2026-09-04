<!-- src/lib/components/docs/sections/go/DocGoMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#go-api">Go Runtime API</a>. Every exported symbol
    in the <code>dixscript</code> package, grouped by category.
    <code>internal/</code> (the raw cgo layer) is deliberately excluded —
    Go's own <code>internal/</code> convention already makes it unimportable
    outside <code>mdix-go</code>, so it was never part of the public surface.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Symbols</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'Version, Load, LoadStr, LoadEncrypted, LoadEncryptedPassword, LoadEncryptedBytes, LoadJSON, LoadToml' },
          { c: 'Database',    d: 'SourcePath, Close, IsValid, EntryCount, Exists, ValueTypeAt, ArrayLength, Keys' },
          { c: 'Read',        d: 'GetString, GetInt, GetInt32, GetInt64, GetFloat32, GetFloat64, GetBool, GetHexColor, GetBlob, GetRegex, GetDate, GetTimestamp, GetEnumName, GetEnumField, GetEnumValue, GetJSON' },
          { c: 'Hot reload',  d: 'EnableHotReload, DisableHotReload, IsHotReloadEnabled, OnReloaded, OnReloadFailed' },
          { c: 'Query',       d: 'QueryManyJSON (Database method); NewQuery, LoadQuery, QueryMany (package funcs); Query[T]: Where, Skip, Take, Any, All, Count, IsEmpty, First, FirstOr, Last, Nth, ToSlice; Select, OrderBy, OrderByDesc, Distinct, GroupBy, MinByKey, MaxByKey, SumInt, SumFloat, AvgFloat' },
          { c: 'Builder',     d: 'NewBuilder, Close, EntryCount, Clear, SetString, SetInt, SetInt32, SetInt64, SetFloat32, SetFloat64, SetBool, SetDate, SetTimestamp, Remove, HasKey, GetString, GetInt, GetInt64, GetFloat32, GetFloat64, GetBool, SaveToFile, ToString, ToDatabase' },
          { c: 'Merge',       d: 'MergeSources, MergeSourcesWeighted' },
          { c: 'Schema',      d: 'NewSchema, Require/Optional + typed shortcuts (RequireString/Int/Long/Float/Double/Bool/Date/Timestamp/HexColor/Blob/Regex/Array/Object/Tuple/Enum, OptionalString/Int/Long/Float/Double/Bool/Array/Object), FieldCount, Paths, Validate' },
          { c: 'Convert',     d: 'Converter.ToJSON, ToMdix, ToToml, FromJSON, FromToml, FormatSource, MinifySource, JSONRoundTrip' },
          { c: 'Value types', d: 'ValueType.String; ParseHexColor/HexColor.String; Blob.Bytes/DecodedSize/String; MdixRegex.Compile/MatchString/String; ParseMdixDate/MdixDate.String; ParseMdixTimestamp/MdixTimestamp.String; MergeStrategy.String; ArrayMergeStrategy.String' },
          { c: 'Errors',      d: 'ErrorKind.String, MdixError.Error' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.c}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <p>
    <code>NewBuilderFunc()</code> also exists as a package-level alias for
    <code>NewBuilder()</code> — same signature, same behavior, just a second
    name for the same constructor. Use whichever reads better; there's no
    functional difference between them.
  </p>
</div>
