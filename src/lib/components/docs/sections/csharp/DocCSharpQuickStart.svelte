<!-- src/lib/components/docs/sections/csharp/DocCSharpQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  debug = false

  server:
    host = "0.0.0.0"
    port<int> = 8080
)`;

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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={quickStart} lang="csharp" />

  <div class="tip-callout">
    <strong>OrThrow vs UnwrapOr</strong>
    <ul>
      <li><strong>Use <code>.OrThrow()</code></strong> for fields the app genuinely can't run without — <code>server.port</code> above, say. A missing required field becomes a loud failure immediately, not a silent default that hides a real config problem.</li>
      <li><strong>Use <code>.UnwrapOr(fallback)</code></strong> for anything with a sensible default — <code>debug</code>, optional feature flags. It reads cleaner than a branch, and a missing optional key isn't actually an error.</li>
      <li><strong>Avoid</strong> reaching for a try/catch around <code>Dix.Load</code> itself — nothing here throws by default. <code>result.IsFailure</code>/<code>result.Error</code> is the whole error-handling story; see <a href="#csharp-api--error-handling">Error Handling</a> for the full <code>MdixResult&lt;T&gt;</code> picture.</li>
    </ul>
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
