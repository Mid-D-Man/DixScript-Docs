<!-- src/lib/components/docs/sections/csharp/DocCSharpDynamicAccess.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const dynamicApi = `// AsDynamic() gives you dynamic member + index access when you don't
// want to declare a POCO for a one-off read.
dynamic cfg = db.AsDynamic();

string host = cfg.server.host;
int    port = cfg.server.port;
string firstEnemyName = cfg.enemies[0].name;

MdixResult<string> json = ((MdixDynamic)cfg).ToJson();`;
</script>

<div class="doc-page">
  <h1>Dynamic Access</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
    <code>MdixDynamic</code> implements <code>DynamicObject</code> for quick
    exploratory reads — property and index access resolve against the
    underlying <code>DixData</code> at runtime. Prefer typed
    <code>Get&lt;T&gt;</code>/<code>Deserialize&lt;T&gt;</code> for anything
    that ships to production; <code>dynamic</code> loses compile-time safety.
  </p>
  <CodeBlock code={dynamicApi} lang="csharp" />
</div>
