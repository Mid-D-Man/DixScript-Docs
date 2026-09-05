<!-- src/lib/components/docs/sections/c/DocCErrorHandling.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const ambiguityC = `int32_t port = mdix_get_int(db, "port");
// port == 0 could mean "the value really is 0" OR "read failed" —
// int32_t has no spare bit for a sentinel. Disambiguate explicitly:

mdix_clear_error();
int32_t port2 = mdix_get_int(db, "port");
if (mdix_get_last_error()) {
    /* real failure — bad path, wrong type, NULL handle, ... */
} else {
    /* port2 is a genuine 0 */
}`;

  const ambiguityCpp = `// The C++ wrapper does this bookkeeping for you — get_int() etc. already
// call mdix_clear_error() first and check mdix_get_last_error() after,
// wrapping the outcome in a Result<T> so a genuine 0 and a failure are
// never confused:
auto port = db->get_int("port");
if (!port) { /* real failure — port.error().message() */ }
else        { /* *port is a genuine 0 (or whatever it is) */ }`;

  const ownershipC = `char*  s   = mdix_get_string(db, "name");   /* free with mdix_free_string(s)      */
char** ks  = mdix_get_keys(db, "", &n);      /* free with mdix_free_string_array() */
void*  db2 = mdix_load(path);                /* free with mdix_free(db2)           */
void*  b   = mdix_builder_new();             /* free with mdix_builder_free(b)     */
void*  w   = mdix_watcher_new(path);         /* free with mdix_watcher_free(w)     */`;
</script>

<div class="doc-page">
  <h1>Error Handling &amp; Ownership</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. No exceptions in
    the C API — failures are <code>NULL</code> or <code>false</code>, and
    every allocation is the caller's to free.
  </p>

  <h2>The NULL / false ambiguity</h2>
  <p>
    Documented directly in <code>mdix.h</code>'s header comment: several
    functions return <code>false</code> or <code>NULL</code> for two
    different reasons — a legitimate negative result (the value really is
    <code>0</code>/<code>false</code>, a watcher genuinely found nothing
    changed) <em>and</em> an actual error (bad handle, I/O failure, parse
    failure). <code>mdix_get_last_error()</code> is how you tell them apart
    — it returns <code>NULL</code> only when there was no error, so call
    <code>mdix_clear_error()</code> before the call you care about and check
    <code>mdix_get_last_error()</code> right after.
  </p>
  <CodeBlock code={ambiguityC} lang="c" />
  <CodeBlock code={ambiguityCpp} lang="cpp" />

  <div class="tip-callout">
    <strong>Where this actually bites</strong>
    <ul>
      <li><code>mdix_get_int</code>/<code>get_long</code>/<code>get_float</code>/<code>get_double</code>/<code>get_bool</code> — a real <code>0</code>/<code>false</code> value vs. a failed read look identical unless you check the error string.</li>
      <li><code>mdix_watcher_has_changed</code> / <code>mdix_watcher_check_and_reload</code> — "unchanged since last check" and "error checking" both come back <code>false</code>/<code>NULL</code>.</li>
      <li><code>mdix_validate</code> — a real parse failure and a <code>NULL</code>/empty source both return <code>false</code>.</li>
    </ul>
  </div>

  <h2>Memory ownership</h2>
  <p>
    <code>mdix.h</code>'s header comment states the rule plainly: every
    <code>char*</code> return must be freed with <code>mdix_free_string()</code>,
    and every handle must be freed with the function matching whatever
    created it.
  </p>
  <CodeBlock code={ownershipC} lang="c" />

  <div class="tip-callout">
    <strong>C++ does this for you</strong>
    <ul>
      <li><code>OwnedString</code> wraps every raw <code>char*</code> internally — by the time a <code>Result&lt;std::string&gt;</code> reaches you, the native string is already copied out and freed.</li>
      <li><code>Database</code>, <code>Builder</code>, and <code>Watcher</code> free their handle in their destructor — move-only types, so ownership transfer (<code>std::move</code>) is explicit and a double-free isn't possible through normal use.</li>
      <li>Passing <code>NULL</code>/an empty handle into most C functions is safe — it returns a sentinel and sets the last-error string rather than crashing. The C++ wrapper's own null checks (<code>h_ ? ... : ...</code>) are a second, redundant layer on top of that, not a workaround for unsafe C behavior.</li>
    </ul>
  </div>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Allocation</th><th>Free with</th></tr></thead>
      <tbody>
        {#each [
          { m: 'A single char* (mdix_get_string, mdix_get_json, export functions, ...)', d: 'mdix_free_string()' },
          { m: 'char** array (mdix_get_keys, mdix_get_all_keys)',                          d: 'mdix_free_string_array(arr, count)' },
          { m: 'A database handle (mdix_load*, mdix_from_json/toml, a merge result)',      d: 'mdix_free()' },
          { m: 'A builder handle (mdix_builder_new/from_handle)',                          d: 'mdix_builder_free()' },
          { m: 'A watcher handle (mdix_watcher_new)',                                      d: 'mdix_watcher_free()' },
          { m: 'C++: any of the above',                                                    d: 'Nothing — RAII destructors handle it automatically.' },
        ] as row}
          <tr>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.m}</td>
            <td><code style="font-size:0.75rem">{row.d}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
