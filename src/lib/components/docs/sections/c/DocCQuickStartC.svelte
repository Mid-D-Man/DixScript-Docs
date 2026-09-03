<!-- src/lib/components/docs/sections/c/DocCQuickStartC.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  host = "localhost"
  port<int> = 8080
)`;

  const quickstart = `#include <mdix.h>
#include <stdio.h>

int main(void) {
    void* db = mdix_load_str(
        "@DATA(\\n  host = \\"localhost\\"\\n  port<int> = 8080\\n)");

    if (!db) {
        fprintf(stderr, "load failed: %s\\n", mdix_get_last_error());
        return 1;
    }

    char* host = mdix_get_string(db, "host");   /* NULL on failure */
    int32_t port = mdix_get_int(db, "port");

    printf("%s:%d\\n", host ? host : "?", port);

    mdix_free_string(host);   /* every char* the API hands back is yours to free */
    mdix_free(db);
    return 0;
}`;
</script>

<div class="doc-page">
  <h1>Quick Start (C)</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. Opaque
    <code>void*</code> handles, caller-freed strings, no exceptions.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={quickstart} lang="c" />

  <p>
    Every function that hands back a <code>char*</code> — <code>mdix_get_string</code>,
    <code>mdix_get_json</code>, the export/conversion functions — is yours to free
    with <code>mdix_free_string()</code>. Every handle-returning function —
    <code>mdix_load</code>, <code>mdix_load_str</code>, <code>mdix_from_json</code>,
    a merge or watcher reload — is yours to free with <code>mdix_free()</code> (or the
    matching <code>mdix_builder_free()</code> / <code>mdix_watcher_free()</code> for
    those handle types). See
    <a href="#c-api--error-handling">Error Handling &amp; Ownership</a> for the full rules.
  </p>
</div>
