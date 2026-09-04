<!-- src/lib/components/docs/sections/rust/DocRustMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Every public item
    across <code>dixscript::Runtime</code>, grouped by category — this is
    the core crate every other language binding wraps.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Items</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'DixLoader::new, new_silent, load_text, load_from_str, compile_with_dlm_from_str, decompile_with_dlm_from_bytes, load_encrypted, load_from_encrypted_bytes, compile_to_resolved_ast, compile_to_resolved_ast_from_str' },
          { c: 'Load options', d: 'DixLoadOptions::new, with_password, with_key_file, with_key_content, with_key_url, with_output_directory, with_key_search_paths, validate' },
          { c: 'Data',        d: 'DixData::from_ast, get<T>, get_or_default<T>, get_value, exists, get_keys, select_many<T>, entry_count, to_hashmap, to_structural_hashmap; Index<&str> for bracket access' },
          { c: 'Query',       d: 'DixData::query(path); DixValue::field, field_path, query; DixQuery: where_, where_field_eq, skip, take, distinct, select, select_field, order_by, order_by_desc, group_by, any, all, count, is_empty, first, first_or, last, nth, sum_int, sum_float, avg_float, min_by_key, max_by_key, to_vec, as_slice, iter' },
          { c: 'Builder',     d: 'DixDataBuilder::new, config, enums, data, with_version, with_compile_time, build, build_and_save; ConfigBuilder (with_version/encoding/author/created/features/custom); EnumsBuilder (with_enum, with_enum_values); DataBuilder (with_int/long/float/double/string/bool, plus group/table variants)' },
          { c: 'Merge',       d: 'MdixMergeInput::new, with_weight, with_label; MdixMerger::new, with_strategy, with_array_strategy, merge, merge_all, merge_files, merge_files_weighted; DixData::merge_files; MdixMergeResult::unwrap, into_result' },
          { c: 'Schema',      d: 'SchemaBuilder::new, require, require_with, require_string/int/long/float/double/bool/array/object/enum, optional, optional_with, optional_string/int/long/float/double/bool/array/object, with_description, field_count; ValidationReport: is_valid, error_count, errors_of_kind, failed_paths' },
          { c: 'Hot reload',  d: 'HotReloadWatcher::new, with_options, path, has_loaded, has_changed, force_reload, check_and_reload' },
          { c: 'Convert',     d: 'DixConverter::new, with_options, resolve_enum_field_value, inline_enum_values, from_hashmap, from_dix_data, to_hashmap, to_mdix, to_json, to_json_flat, from_json, to_toml, from_toml' },
          { c: 'Format options', d: 'DixFormatOptions::new, compact, minified, pretty, get_indentation, get_newline, get_space' },
          { c: 'Serde (serialize)',   d: 'DixSerialize trait; dix_set_str/int/long/float/double/bool, dix_set_nested, dix_set_array_of (free functions); DataBuilder::serialize, serialize_at' },
          { c: 'Serde (deserialize)', d: 'DixDeserialize trait; dix_get, dix_get_or, dix_nested, dix_array_of, dix_value, dix_path (free functions); DixData::deserialize, deserialize_at' },
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
