<!-- src/lib/components/docs/sections/csharp/DocCSharpPoco.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const deserializeApi = `public class ServerConfig
{
    public string Host { get; set; } = "";
    public int Port { get; set; }
    public bool Ssl { get; set; }
}

// Deserialize a POCO from a prefix within the loaded data
MdixResult<ServerConfig> cfg = db.Deserialize<ServerConfig>("server");

// Or in one call straight from a file path
MdixResult<ServerConfig> cfg2 = Dix.Deserialize<ServerConfig>("config.mdix", "server");
MdixResult<ServerConfig> cfg3 = Dix.DeserializeFrom<ServerConfig>(db, "server");`;
</script>

<div class="doc-page">
  <h1>POCO Deserialization</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>
  <CodeBlock code={deserializeApi} lang="csharp" />
</div>
