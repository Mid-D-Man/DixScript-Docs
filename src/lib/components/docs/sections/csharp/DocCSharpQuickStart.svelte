<!-- src/lib/components/docs/sections/csharp/DocCSharpQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const quickStart = `using MidManStudio.Mdix;

// Dix is the static one-liner facade — the primary entry point
var result = Dix.Load("config.mdix");

if (result.IsFailure)
{
    Console.WriteLine($"Load failed: {result.Error}");
    return;
}

using var db = result.SuccessResult; // MdixDatabase implements IDisposable

int  port  = db.GetInt("server.port").OrThrow();
string host = db.GetString("server.host").UnwrapOr("localhost");
bool  debug = db.GetBool("debug").UnwrapOr(false);

Console.WriteLine($"{host}:{port} debug={debug}");`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
    <code>Dix</code> is the static facade — the entry point for almost
    everything in this binding.
  </p>
  <CodeBlock code={quickStart} lang="csharp" />
</div>
