<!-- src/lib/components/docs/sections/c/DocCMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. Every function in
    <code>mdix.h</code> and every method in <code>mdix.hpp</code>'s RAII
    wrapper, grouped by category.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>C (mdix.h)</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'mdix_load, mdix_load_str, mdix_load_encrypted, mdix_load_encrypted_password, mdix_load_encrypted_bytes, mdix_from_json, mdix_from_toml' },
          { c: 'Metadata',    d: 'mdix_entry_count, mdix_is_encrypted, mdix_is_compressed, mdix_get_loaded_version, mdix_get_config_value' },
          { c: 'Read',        d: 'mdix_exists, mdix_get_type, mdix_get_array_length, mdix_get_keys, mdix_get_all_keys, mdix_get_string, mdix_get_int, mdix_get_long, mdix_get_float, mdix_get_double, mdix_get_bool, mdix_get_enum_name, mdix_get_enum_field, mdix_get_json' },
          { c: 'Query',       d: 'mdix_select_many_as_json' },
          { c: 'Builder',     d: 'mdix_builder_new, mdix_builder_from_handle, mdix_builder_free, mdix_builder_entry_count, mdix_builder_clear, mdix_builder_set_string/int/long/float/double/bool, mdix_builder_remove, mdix_builder_has_key, mdix_builder_get_string/int/long/float/double/bool, mdix_builder_to_string, mdix_builder_save' },
          { c: 'Merge',       d: 'mdix_merge_sources, mdix_merge_sources_weighted' },
          { c: 'Hot reload',  d: 'mdix_watcher_new, mdix_watcher_free, mdix_watcher_path, mdix_watcher_has_loaded, mdix_watcher_has_changed, mdix_watcher_check_and_reload, mdix_watcher_force_reload' },
          { c: 'Format/Convert', d: 'mdix_to_json, mdix_to_toml, mdix_to_mdix, mdix_format_source, mdix_minify_source, mdix_compact_source, mdix_strip_comments, mdix_validate' },
          { c: 'Memory',      d: 'mdix_free, mdix_free_string, mdix_free_string_array' },
          { c: 'Errors',      d: 'mdix_get_last_error, mdix_clear_error' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.c}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="table-scroll" style="margin-top:1.5rem">
    <table>
      <thead><tr><th>Category</th><th>C++ (mdix.hpp)</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Database — load',  d: 'Database::load, load_str, load_encrypted, load_encrypted_password, load_encrypted_bytes, from_json, from_toml, adopt(handle)' },
          { c: 'Database — read',  d: 'entry_count, is_encrypted, is_compressed, get_loaded_version, get_config_value, exists, get_type, get_array_length, get_keys, get_all_keys, get_string, get_int, get_long, get_float, get_double, get_bool, get_enum_name, get_enum_field, get_json — the typed getters all return Result<T>' },
          { c: 'Database — query/convert', d: 'query_many, to_json, to_toml, to_mdix, validate_schema (via a schema type), merge_with' },
          { c: 'Builder',           d: 'Builder(): set_string/int/long/float/double/bool (fluent, chainable), remove, has_key, get_string/int/long/float/double/bool, to_string, save, to_database, Builder::from_handle(db)' },
          { c: 'Watcher',           d: 'Watcher(path): path, has_loaded, has_changed, check_and_reload, force_reload' },
          { c: 'Merge (free functions)', d: 'merge_sources(sources, strategy, arrayStrategy) -> Result<MergeResult> { database, conflicts, has_conflicts() }; MergeConflict { path, winning_source, winning_label }' },
          { c: 'Format (free functions)', d: 'format_source, minify_source, compact_source, strip_comments, validate' },
          { c: 'Result<T>',        d: 'operator bool, operator->, operator*, value(), value_or(fallback), error()' },
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
