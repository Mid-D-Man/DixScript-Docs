<!-- src/lib/components/docs/sections/wasm/DocWasmMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WASM / npm Runtime API</a>. Every
    <code>#[wasm_bindgen]</code>-exported symbol in <code>@midmanstudio/mdix</code>,
    grouped by category — JS method names as they actually appear (camelCase,
    via each item's <code>js_name</code>), not the Rust source names.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Methods</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'MdixDatabase.loadStr, fromJson, fromToml; prefetchImport(url, content) — seeds the cloud-import cache, see Cloud Imports' },
          { c: 'Database',    d: 'free, isValid, entryCount, getValueType, exists, getKeys(prefix)' },
          { c: 'Read',        d: 'getString, getInt, getLong, getFloat, getDouble, getBool, getJson, getArrayLength, getEnumName, getEnumField' },
          { c: 'Query',       d: 'query(path), queryMany(pattern) — both return a JSON string, not a chainable object' },
          { c: 'Convert',     d: 'toJson(indented), toToml, toMdix' },
          { c: 'Merge',       d: 'mergeSources(sources, strategy?, arrayStrategy?), mergeSourcesWeighted(pairs, …) — free functions returning MdixMergeOutcome (.database(), .conflicts()); Database.mergeWith(other, …)' },
          { c: 'Schema',      d: 'new MdixSchema(): requireString/Int/Long/Float/Double/Bool/Array/Object/Enum, optionalString/Int/Long/Float/Double/Bool/Array/Object, withDescription, fieldCount, paths; Database.validateSchema(schema) -> report with isValid, errorCount, failedPaths' },
          { c: 'Builder',     d: 'new MdixBuilder(): free, isValid, setConfigVersion/Author/Encoding/DebugMode, setConfig, addEnum, withString/Int/Long/Float/Double/Bool/HexColor/Date/Timestamp/Blob/Regex/EnumValue/Array/Object/Tuple' },
          { c: 'Hot reload',  d: 'new MdixWatcher(): hasChanged(source), check(source), reset — takes the source text each call, not a stored file path (no filesystem access in a browser); MdixWatchOutcome.changed (getter), .database() (consumes the result, throws if called twice)' },
          { c: 'Cloud imports (DLM)', d: 'compileWithDlm(source, sourceLabel), decompileWithDlm(bytes, …) — MdixDlmOutcome: isSuccess, processedData, keyFileContent, executedModules, errors, warnings' },
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
