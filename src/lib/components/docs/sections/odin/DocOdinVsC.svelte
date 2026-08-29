<!-- src/lib/components/docs/sections/odin/DocOdinVsC.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>vs the raw C API</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Concept</th><th>C (mdix.h)</th><th>Odin (mdix package)</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Errors',   ch: 'NULL / false sentinel + mdix_get_last_error()', od: '(value, ok) return tuple, mdix.last_error()' },
          { c: 'Strings',  ch: 'caller must free with mdix_free_string()',       od: 'caller-owned via allocator, delete()' },
          { c: 'Handles',  ch: 'opaque pointer, manual free',                    od: 'Database/Builder structs, destroy()/builder_destroy()' },
          { c: 'Wildcards',ch: 'not exposed',                                    od: 'select_many_as_json(db, pattern)' },
          { c: 'Formatting', ch: 'not exposed',                                  od: 'format_source / minify_source / compact_source / strip_comments' },
        ] as row}
          <tr>
            <td style="font-weight:500">{row.c}</td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.ch}</td>
            <td><code style="font-size:0.75rem">{row.od}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
