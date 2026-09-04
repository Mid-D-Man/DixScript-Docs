<!-- src/lib/components/docs/sections/odin/DocOdinMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#odin-api">Odin Runtime API</a>. Every exported
    procedure in the <code>mdix</code> package, grouped by category.
    <code>mdix_ffi</code> (the raw extern declarations) is deliberately
    excluded — the same relationship as a C header to a hand-written
    wrapper, not part of the ergonomic surface this section documents.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Procedures</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'last_error, clear_error, version, is_valid, load, load_str, load_encrypted, load_encrypted_password, load_encrypted_bytes, from_json, from_toml, destroy' },
          { c: 'Metadata',    d: 'entry_count, is_encrypted, is_compressed, loaded_version, config_value, validate' },
          { c: 'Read',        d: 'get_type, array_length, exists, get_string, get_int, get_long, get_float, get_double, get_bool, get_enum_name, get_enum_field, get_enum_value, get_json, get_hex_color, get_blob, get_regex, get_date, get_timestamp' },
          { c: 'Keys/Query',  d: 'select_many_as_json, get_keys, get_all_keys; query_new, query_load, query_many, query_delete, query_where, query_skip, query_take, query_any, query_all, query_count, query_is_empty, query_first, query_first_or, query_last, query_nth, query_select, query_order_by, query_order_by_desc, query_distinct, query_group_by, query_min_by_key, query_max_by_key, query_sum_int, query_sum_float, query_avg_float' },
          { c: 'Convert',     d: 'to_json, to_toml, to_mdix, format_source, minify_source, compact_source, strip_comments' },
          { c: 'Builder',     d: 'builder_new, builder_from_database, builder_destroy, builder_entry_count, builder_clear, builder_set_string, builder_set_int, builder_set_long, builder_set_float, builder_set_double, builder_set_bool, builder_remove, builder_has_key, builder_get_string, builder_get_int, builder_get_long, builder_get_float, builder_get_double, builder_get_bool, builder_to_string, builder_save, builder_to_database' },
          { c: 'Merge',       d: 'merge_sources, merge_sources_weighted' },
          { c: 'Schema',      d: 'schema_new, schema_destroy, schema_field_count, schema_require, schema_optional, schema_require_string, schema_require_double, schema_require_object, schema_optional_string, schema_optional_double, schema_validate; validation_error_to_string, validation_report_is_valid, validation_report_destroy' },
          { c: 'Hot reload',  d: 'hot_reload_init, hot_reload_destroy, hot_reload_check' },
          { c: 'Value types', d: 'parse_hex_color, blob_bytes, regex_compile, parse_mdix_date, parse_mdix_timestamp' },
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
    <code>Schema</code>'s typed shortcuts are noticeably thinner than every
    other binding's — only <code>schema_require_string</code>/<code>_double</code>/<code>_object</code>
    and <code>schema_optional_string</code>/<code>_double</code> exist.
    There's no <code>_int</code>, <code>_long</code>, <code>_float</code>,
    <code>_bool</code>, <code>_array</code>, or <code>_enum</code> shortcut
    on either side — checked directly against <code>schema.odin</code>, not
    an omission on this page. Use <code>schema_require(s, path,
    ffi.Mdix_Type.Int)</code> / <code>schema_optional(...)</code> directly
    for any type without a shortcut.
  </p>
</div>
