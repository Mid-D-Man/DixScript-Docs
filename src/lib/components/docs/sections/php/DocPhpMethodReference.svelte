<!-- src/lib/components/docs/sections/php/DocPhpMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. Every public method
    across the <code>MidManStudio\Mdix\</code> namespace, grouped by
    category. <code>MidManStudio\Mdix\Internal\NativeLoader</code> is
    deliberately excluded — an implementation detail, never part of the
    public surface.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Methods</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',       d: 'MdixDatabase::adopt, load, loadStr, loadEncrypted, loadEncryptedPassword, fromJson, fromToml; try-variants: tryLoad, tryLoadStr, tryFromJson, tryFromToml' },
          { c: 'Database',   d: 'close, isValid, entryCount, isCompressed, isEncrypted, getLoadedVersion, getConfigValue, tryGetConfigValue, exists, valueTypeAt, arrayLength, keys, getAllKeys, toJson, toMdix, toToml' },
          { c: 'Read',       d: 'getString, getInt, getLong, getFloat, getDouble, getBool (each takes an optional default), getEnumName, getEnumField, getEnumValue, getJson; try-variants: tryGetString, tryGetInt, tryGetLong, tryGetFloat, tryGetDouble, tryGetBool, tryGetJson' },
          { c: 'Query',      d: 'MdixDatabase::query, queryMany — both return MdixQuery; MdixQuery: where, whereFieldEquals, skip, take, distinct, select, selectField, orderBy, orderByDescending, groupBy, any, all, count, isEmpty, first, firstOr, last, nth, sumInt, sumFloat, avgFloat, minByKey, maxByKey, toArray' },
          { c: 'Builder',    d: 'new MdixBuilder(), fromHandle, close, entryCount, clear, setString, setInt, setLong, setFloat, setDouble, setBool, setDate, setTimestamp, remove, hasKey, getString, getInt, getLong, getFloat, getDouble, getBool, saveToFile, toMdixString, toDatabase, tryToDatabase' },
          { c: 'Merge',      d: 'MdixMerge::sources, sourcesWeighted, databases, databasesWeighted; MdixMergeResult.hasConflicts' },
          { c: 'Convert',    d: 'MdixConverter::toJson, toMdix, toToml, fromJson, fromToml, formatSource, minifySource, jsonRoundTrip; try-variants: tryToJson, tryFromJson, tryFromToml, tryFormatSource' },
          { c: 'Schema',     d: 'new MdixSchemaBuilder(): require, requireWith, requireString/Int/Long/Float/Double/Bool/Array/Object/Enum, optional, optionalWith, optionalString/…/Enum, withDescription, fieldCount, paths, validate; MdixValidationReport: isValid, errorCount, errorsOfKind, failedPaths' },
          { c: 'Hot reload', d: 'new MdixHotReload(path): close, path, hasLoaded, hasChanged, checkAndReload, forceReload' },
          { c: 'Result',     d: 'MdixResult::ok, err, fromThrowable; isSuccess, isFailure, getValue, getError, orRaise, unwrap, unwrapOr, unwrapOrElse, map, andThen, ensure, or, fold, tap, tapError' },
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
    Unlike the raw C API, <code>MdixDatabase</code> has no
    <code>loadEncryptedBytes</code>-style in-memory encrypted loader — only
    <code>loadEncrypted</code>/<code>loadEncryptedPassword</code>, both
    file-path based. Checked directly against <code>MdixDatabase.php</code>;
    if you need to load encrypted bytes already in memory, write them to a
    temp file first.
  </p>
</div>
