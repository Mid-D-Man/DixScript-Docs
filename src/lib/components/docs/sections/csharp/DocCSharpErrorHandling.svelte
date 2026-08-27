<!-- src/lib/components/docs/sections/csharp/DocCSharpErrorHandling.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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

// MdixErrorKind: NotFound, TypeMismatch, NullHandle, InvalidPath,
// NativeError, IoError, ParseError, SchemaError, Disposed`;
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
  <CodeBlock code={mdixResult} lang="csharp" />
</div>
