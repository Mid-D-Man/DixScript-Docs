<!-- src/lib/components/docs/sections/odin/DocOdinBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `b := mdix.builder_new()
defer mdix.builder_destroy(&b)

mdix.builder_set_string(b, "app_name", "MyGame")
mdix.builder_set_int(b, "port", 8080)
mdix.builder_set_long(b, "session_id", 9_000_000_000)
mdix.builder_set_float(b, "ratio", 0.75)
mdix.builder_set_double(b, "pi", 3.14159)
mdix.builder_set_bool(b, "ssl", true)

mdix.builder_has_key(b, "app_name")   // bool
mdix.builder_remove(b, "app_name")    // bool
mdix.builder_entry_count(b)           // int
mdix.builder_clear(b)                 // bool — reset everything

// Read back values already staged in the builder
name, ok := mdix.builder_get_string(b, "app_name")
defer delete(name)

// Finish
ok = mdix.builder_save(b, "profile.mdix")
src, ok := mdix.builder_to_string(b)
defer delete(src)
db, ok := mdix.builder_to_database(b)
defer mdix.destroy(&db)

// Round-trip an existing database into a builder to modify it
b2 := mdix.builder_from_database(db)`;
</script>

<div class="doc-page">
  <h1>Building Programmatically</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={builderApi} lang="odin" />
</div>
