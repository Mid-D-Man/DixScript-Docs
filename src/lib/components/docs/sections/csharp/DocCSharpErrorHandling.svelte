<!-- src/lib/components/docs/sections/csharp/DocCSharpErrorHandling.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  server:
    port<int> = 8080
)`;

  const mdixResult = `// Every fallible operation returns MdixResult<T> instead of throwing.
MdixResult<int> portResult = db.GetInt("server.port");

if (portResult.IsSuccess)
{
    int port = portResult.SuccessResult;
}
else
{
    MdixError error = portResult.Error;     // .Kind, .Message, .Path, .InnerException
}

// Terminal operations
int a = portResult.OrThrow();                       // throws MdixException on failure
int b = portResult.Unwrap();                         // alias for OrThrow()
int c = portResult.UnwrapOr(8080);                    // fallback value
int d = portResult.UnwrapOrElse(err => 8080);         // fallback factory

// Pattern matching
portResult.Match(
    onSuccess: p => Console.WriteLine($"port={p}"),
    onFailure: e => Console.WriteLine($"error={e.Kind}"));

string label = portResult.Match(
    onSuccess: p => $"port {p}",
    onFailure: e => $"failed: {e.Message}");

// Functional chaining
MdixResult<string> asString = portResult.Map(p => p.ToString());
MdixResult<int> doubled = portResult.AndThen(p =>
    p > 0 ? MdixResult<int>.Ok(p * 2) : MdixResult<int>.Err(MdixError.InvalidPath("port")));

// Trying to read a path that doesn't exist in the example file above:
MdixResult<string> missing = db.GetString("server.host");
// missing.Error.Kind == MdixErrorKind.NotFound`;
</script>

<div class="doc-page">
  <h1>MdixResult&lt;T&gt; — Error Handling</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. Nothing in
    this API throws by default. Every fallible call returns
    <code>MdixResult&lt;T&gt;</code>, a discriminated success/failure wrapper
    with functional combinators — the same shape used throughout every
    other language binding, just C#-flavoured.
  </p>

  <h2>Example .mdix file</h2>
  <p>Reading <code>server.host</code> against this file fails — it's not there — which is exactly what the last example below shows.</p>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={mdixResult} lang="csharp" />

  <div class="tip-callout">
    <strong>Picking a terminal operation</strong>
    <ul>
      <li><strong>Use <code>Match</code></strong> when both outcomes need real handling — it forces you to write both branches, so you can't accidentally forget the failure case the way an early <code>if (result.IsFailure) return;</code> is easy to skip under deadline pressure.</li>
      <li><strong>Use <code>OrThrow</code>/<code>Unwrap</code></strong> at a boundary where failure really is exceptional and something further up should catch it — app startup reading a config that must be valid, for instance.</li>
      <li><strong>Use <code>UnwrapOr</code>/<code>UnwrapOrElse</code></strong> for optional values with a real default, same as <a href="#csharp-api--quickstart">Quick Start</a>'s guidance.</li>
      <li><strong>Avoid</strong> checking <code>IsSuccess</code>/<code>IsFailure</code> and then reaching into <code>.SuccessResult</code>/<code>.Error</code> manually as a matter of habit — that's what <code>Match</code> exists to replace; reach for the raw properties only when you genuinely need one branch's value without acting on the other.</li>
    </ul>
  </div>

  <h2>MdixErrorKind Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Kind</th><th>Meaning</th></tr></thead>
      <tbody>
        {#each [
          { k: 'NotFound',      d: 'The requested path does not exist in the loaded data.' },
          { k: 'TypeMismatch',  d: 'The value at the path cannot be converted to the requested type.' },
          { k: 'NullHandle',    d: 'The native handle is null or has already been freed.' },
          { k: 'InvalidPath',   d: 'The path string is null or empty.' },
          { k: 'NativeError',   d: 'The native FFI layer returned an error.' },
          { k: 'IoError',       d: 'A file system operation failed.' },
          { k: 'ParseError',    d: 'The source could not be parsed as valid DixScript.' },
          { k: 'SchemaError',   d: 'The loaded data does not match the expected schema.' },
          { k: 'Disposed',      d: 'The object has been disposed and cannot be used.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.k}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
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
