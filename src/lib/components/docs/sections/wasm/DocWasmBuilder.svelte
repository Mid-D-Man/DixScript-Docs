<!-- src/lib/components/docs/sections/wasm/DocWasmBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `import { MdixBuilder } from "@midmanstudio/mdix";

const db = new MdixBuilder()
  .setConfigVersion("1.0.0")
  .addEnum("LogLevel", JSON.stringify(["DEBUG", "INFO", "WARN", "ERROR"]))
  // Tier 1 — flat properties MUST come first
  .withString("app_name", "MyGame")
  .withInt("port", 8080)
  .withBool("ssl", true)
  .withEnumValue("log_level", "LogLevel", "INFO")
  // Tier 2 — grouped data, after all flat properties
  .withTableProperties("server", JSON.stringify({
    host: "localhost",
    port: 8080,
    ssl:  true
  }))
  .withGroupArray("admins", JSON.stringify(["alice", "bob"]))
  .withGroupArray("enemies", JSON.stringify([
    { name: "Goblin", hp: 50 },
    { name: "Orc",    hp: 100 }
  ]))
  .toDatabase();

console.log(db.getString("app_name")); // "MyGame"
console.log(db.getInt("server.port")); // 8080
db.free();

// Violating the two-tier order throws immediately, at the call that breaks it:
new MdixBuilder()
  .withTableProperties("server", JSON.stringify({ port: 8080 }))
  .withString("name", "MyApp"); // throws here — flat property after grouped data`;
</script>

<div class="doc-page">
  <h1>Building Programmatically</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    <code>MdixBuilder</code> enforces DixScript's two-tier
    <code>@DATA</code> rule: flat properties must be added before any
    table properties or group arrays. A violation throws immediately, at
    the call that breaks the order — not deferred to <code>toDatabase()</code>.
  </p>
  <CodeBlock code={builderApi} lang="javascript" />
</div>
