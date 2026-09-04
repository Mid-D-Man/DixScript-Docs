<!-- src/lib/components/docs/sections/python/DocPythonMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>. Every public
    class and function in <code>midmanstudio.mdix</code> (plus
    <code>midmanstudio.mdix.ml</code>), grouped by category. The package
    is a PyO3-compiled Rust extension — this reflects
    <code>src/*.rs</code>'s <code>#[pymethods]</code>/<code>#[pyfunction]</code>
    surface, not <code>__init__.py</code>, which just re-exports the
    compiled <code>._mdix</code> module.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Methods</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',       d: 'MdixDatabase.load, load_str, from_json, from_toml, load_encrypted, load_encrypted_password, from_table; try_load, try_load_str, try_from_json, try_from_toml' },
          { c: 'Database',   d: 'close/__enter__/__exit__ (context manager), is_valid, entry_count, exists, get_type, get_array_length, get_keys(prefix="")' },
          { c: 'Read',       d: 'get_string, get_int, get_long, get_float, get_double, get_bool (each takes default=), get_json, get_enum_name, get_enum_field; try_get_* twins for each' },
          { c: 'Export',     d: 'to_json(indented=True), to_toml, to_mdix, to_table' },
          { c: 'Query',      d: 'Database.query(path), query_many(pattern) — both return MdixQuery; where_, where_field_eq, skip, take, distinct, select, order_by, order_by_desc, group_by, any, all, count, is_empty, first, first_or, last, nth, sum_int, sum_float, avg_float, min_by_key, max_by_key, to_list; also __len__, __getitem__, __bool__' },
          { c: 'Builder',    d: 'MdixBuilder(), set_config, add_enum, set_string/int/long/float/double/bool/date/timestamp/hex_color/blob/regex/enum/array/tuple/object, with_table_properties, with_group_array, to_database, try_to_database, serialize, reset_grouped, reset' },
          { c: 'Merge',      d: 'MdixMerger(): with_strategy, with_array_strategy, merge_files, merge_files_weighted, merge_strings, try_merge_files, try_merge_files_weighted; MdixDatabase.merge_with(other, …) -> (db, conflicts)' },
          { c: 'Schema',     d: 'MdixSchemaBuilder(): require, require_string/int/long/float/double/bool/array/object/enum, optional, optional_string/int/long/float/double/bool/array/object, with_description, field_count, paths, validate; also Database.validate_schema(schema). MdixValidationReport: is_valid, error_count, errors, failed_paths, errors_of_kind, __bool__' },
          { c: 'Hot reload', d: 'MdixWatcher(path): check, force_reload, has_changed, has_loaded, path' },
          { c: 'Result',     d: 'MdixResult.ok/err/__class_getitem__; is_success, is_failure, value, error, or_raise, unwrap, unwrap_or, unwrap_or_else, map, and_then, ensure, or_, fold, tap, tap_error, __bool__' },
          { c: 'ML extras',  d: '(midmanstudio.mdix.ml, optional) MdixNumpy: store, load, try_load, exists, array_info. MdixTensor: store, load_numpy, load_torch, load_tf. MdixDataFrame: store, load, try_load. MdixMLConfig: load, load_str, builder, database, hyperparameter, architecture, dataset_path, training, label_map, all_hyperparameters, load_weights, weights_info' },
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
    <code>MdixDatabase.get_enum_value</code> doesn't exist here — Go, Java,
    and PHP all have it, Python only has <code>get_enum_name</code>/
    <code>get_enum_field</code>. And merge conflict reporting doesn't
    actually surface anywhere in this binding — see
    <a href="#python-api--merger">MdixMerger</a> for the details.
  </p>
</div>
