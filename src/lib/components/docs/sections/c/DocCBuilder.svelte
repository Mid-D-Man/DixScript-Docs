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
</div>
