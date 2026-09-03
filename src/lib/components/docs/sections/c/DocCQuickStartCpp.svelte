<!-- src/lib/components/docs/sections/c/DocCQuickStartCpp.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  host = "localhost"
  port<int> = 8080
)`;

  const quickstart = `#include <mdix.hpp>
#include <iostream>

int main() {
    auto db = mdix::Database::load_str(
        "@DATA(\\n  host = \\"localhost\\"\\n  port<int> = 8080\\n)");

    if (!db) {
        std::cerr << "load failed: " << db.error().message() << '\\n';
        return 1;
    }

    int  port = db->get_int("port").value_or(0);
    auto host = db->get_string("host").value_or("?");

    std::cout << host << ':' << port << '\\n';
    return 0;
    // db goes out of scope here — its native handle is freed automatically,
    // and OwnedString inside get_string()'s Result is already gone by the
    // time value_or() copies out a std::string
}`;
</script>

<div class="doc-page">
  <h1>Quick Start (C++)</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. RAII everywhere —
    <code>Database</code>, <code>Builder</code>, and <code>Watcher</code> all
    free their native handle in their destructor, and every fallible call
    returns a <code>Result&lt;T&gt;</code> instead of a sentinel value.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={quickstart} lang="cpp" />

  <p>
    <code>Result&lt;T&gt;</code> is explicitly convertible to <code>bool</code>,
    has <code>operator-&gt;</code>/<code>operator*</code> for direct access when
    you already know it succeeded, and <code>value_or(fallback)</code> for a
    one-liner default. Calling <code>.value()</code> on a failed result throws
    <code>std::runtime_error</code> — reach for it only at a boundary where a
    failure genuinely is a programmer error, not on a call you expect might
    legitimately fail.
  </p>
</div>
