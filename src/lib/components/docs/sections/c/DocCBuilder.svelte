<!-- src/lib/components/docs/sections/c/DocCBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const builderC = `void* b = mdix_builder_new();

mdix_builder_set_string(b, "name", "goblin");
mdix_builder_set_int   (b, "hp", 30);
mdix_builder_set_bool  (b, "aggressive", true);
mdix_builder_remove    (b, "name");        // undo a set before saving

mdix_builder_has_key   (b, "hp");           // bool
int32_t hp = mdix_builder_get_int(b, "hp");

char* out = mdix_builder_to_string(b);      // free with mdix_free_string()
mdix_builder_save(b, "enemy.mdix");         // bool

// Round-trip editing: pre-populate from an already-loaded database
void* db = mdix_load("config.mdix");
void* b2 = mdix_builder_from_handle(db);    // root-level values carried over
mdix_builder_set_int(b2, "port", 9090);     // change one field
mdix_builder_save(b2, "config.mdix");

mdix_builder_free(b);
mdix_builder_free(b2);
mdix_free(db);`;

  const builderCpp = `mdix::Builder b;

b.set_string("name", "goblin")
 .set_int("hp", 30)
 .set_bool("aggressive", true);    // fluent — every set_* returns Builder&

b.remove("name");
b.has_key("hp");                    // bool
std::optional<int32_t> hp = b.get_int("hp");

auto text = b.to_string();          // Result<std::string>
b.save("enemy.mdix");               // bool
auto db2 = b.to_database();         // Result<Database> — parses to_string() straight back

// Round-trip editing
auto db = mdix::Database::load("config.mdix").value();
auto b2 = mdix::Builder::from_handle(db);
if (b2) {
    b2->set_int("port", 9090);
    b2->save("config.mdix");
}`;
</script>

<div class="doc-page">
  <h1>Builder API</h1>
  <p class="page-lead">Part of the <a href="#c-api">C / C++ Runtime API</a>.</p>

  <CodeBlock code={builderC} lang="c" />
  <CodeBlock code={builderCpp} lang="cpp" />

  <p>
    <code>mdix_builder_from_handle()</code> pre-populates a builder with the
    source database's root-level values — for load → tweak a few keys → save
    round-trip editing, rather than reconstructing a file from scratch.
    Synthetic indexed children (<code>tags[0]</code>, <code>server.host</code>)
    are already stripped; only aggregate/root values that map back to valid
    <code>.mdix</code> identifiers carry over.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>C</th><th>C++</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { c: 'mdix_builder_new / mdix_builder_from_handle(db)', cpp: 'Builder() / Builder::from_handle(db) — returns Result<Builder>', d: 'Create empty, or pre-populate from an already-loaded database.' },
          { c: 'mdix_builder_free(b)',           cpp: '.reset() — also called automatically by the destructor', d: 'Free the native handle.' },
          { c: 'mdix_builder_set_string/int/long/float/double/bool(b, path, v)', cpp: '.set_string/int/long/float/double/bool(path, v) — fluent, chainable', d: 'Set a flat property value.' },
          { c: 'mdix_builder_has_key / mdix_builder_remove(b, path)', cpp: '.has_key / .remove(path)', d: 'Check for, or remove, a previously-set property.' },
          { c: 'mdix_builder_get_string/int/long/float/double/bool(b, path)', cpp: '.get_string/int/long/float/double/bool(path) — returns std::optional<T>', d: 'Read back a value already staged on the builder.' },
          { c: 'mdix_builder_entry_count / mdix_builder_clear(b)', cpp: '.entry_count() / .clear()', d: 'Number of set properties / reset the builder to empty.' },
          { c: 'mdix_builder_save(b, path)',      cpp: '.save(path)',               d: 'Write the built source directly to a file.' },
          { c: 'mdix_builder_to_string(b)',       cpp: '.to_string()',              d: 'Produce the raw .mdix source string.' },
          { c: '(build the string, then mdix_load_str it)', cpp: '.to_database()',  d: 'Parse the built source into a Database — C++ only convenience.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.c}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.cpp}</td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
