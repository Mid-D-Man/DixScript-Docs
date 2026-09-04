<!-- src/lib/components/docs/sections/java/DocJavaMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java Runtime API</a>. Every public
    method in <code>com.midmanstudio.dixscript</code>, grouped by category.
    <code>internal.*</code> (the raw JNI layer) is deliberately excluded —
    package-private to <code>dixscript</code>, never part of the public
    surface.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Methods</th></tr></thead>
      <tbody>
        {#each [
          { c: 'DixScript facade', d: 'version, load, loadStr, loadEncrypted, loadEncryptedPassword, loadJson, loadToml, newBuilder, convert' },
          { c: 'Database',   d: 'close, isValid, entryCount, exists, valueTypeAt, arrayLength, keys(prefix)/keys(), getJson' },
          { c: 'Read',       d: 'getString, getInt, getLong, getFloat, getDouble, getBool (each with a (path, defaultValue) overload), getEnumName, getEnumField, getEnumValue' },
          { c: 'Query',      d: 'Database.query(path), Database.queryMany(pattern) — both return MdixQuery; MdixQuery: where_, whereFieldEquals, skip, take, distinct, select, selectField, orderBy, orderByDescending, groupBy, any, all, count, isEmpty, first, firstOr, last, nth, sumInt, sumFloat, avgFloat, minByKey, maxByKey, toList, stream' },
          { c: 'Builder',    d: 'new Builder(), close, entryCount, clear, setString, setInt, setLong, setFloat, setDouble, setBool, setDate, setTimestamp, remove, hasKey, saveToFile, toMdixString, toDatabase' },
          { c: 'Merge',      d: 'Merge.sources(...), Merge.sourcesWeighted(...), Merge.databases(...), Merge.databasesWeighted(...) — all return Result; Result.hasConflicts, Result.toString' },
          { c: 'Convert',    d: 'Converter (via DixScript.convert()): toJson, toMdix, toToml, fromJson, fromToml, formatSource, minifySource, jsonRoundTrip' },
          { c: 'Schema',     d: 'new SchemaBuilder(): require, requireWith, requireString/Int/Long/Float/Double/Bool/Array/Object/Enum, optional, optionalWith, optionalString/Int/Long/Float/Double/Bool/Array/Object/Enum, withDescription, fieldCount, paths, validate; Report: isValid, errorCount, errorsOfKind, failedPaths' },
          { c: 'Hot reload', d: 'new HotReload(path): close, path, hasLoaded, hasChanged, checkAndReload, forceReload' },
          { c: 'MdixValue',  d: 'ofBool, ofLong, ofDouble, ofString, ofArray, ofObject, ofEnum, NULL; kind, isNull, asBool, asLong, asDouble, asString, asArray, asObject, asEnum, field, fieldPath, at' },
          { c: 'Errors',     d: 'MdixException(message | message,cause | kind,message), getKind; ValueType.getCode, ValueType.fromCode' },
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
