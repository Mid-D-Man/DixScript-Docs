<!-- src/lib/components/docs/sections/python/DocPythonResult.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const railway = `from midmanstudio.mdix import MdixDatabase

# Railway-style chaining — every try_* method returns MdixResult, never raises
value = (MdixDatabase.try_load_str(source)
         .and_then(lambda db: db.try_get_int("port"))
         .ensure(lambda p: p > 1024, "port must be > 1024")
         .map(lambda p: p * 2)
         .unwrap_or(3000))

# fold — explicit success / failure branches, one call
message = (MdixDatabase.try_load("config.mdix")
           .and_then(lambda db: db.try_get_string("server.host"))
           .map(str.upper)
           .tap(lambda v: print(f"host = {v}"))
           .fold(
               on_success=lambda v: f"Loaded: {v}",
               on_failure=lambda e: f"Failed: {e}"))

result = MdixDatabase.try_load("config.mdix")
if result:                       # bool(result) is True on success
    db = result.value
else:
    print(result.error)

# Full combinator set: ok / err / is_success / is_failure / value / error /
# or_raise / unwrap / unwrap_or / unwrap_or_else / map / and_then / ensure /
# or_ / fold / tap / tap_error`;
</script>

<div class="doc-page">
  <h1>MdixResult — Railway Programming</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>. Every
    <code>load</code>/<code>get</code> method has a <code>try_*</code>
    twin that returns <code>MdixResult</code> instead of raising — chain
    operations with <code>and_then</code>/<code>map</code>/<code>ensure</code>
    instead of nested try/except.
  </p>
  <CodeBlock code={railway} lang="python" />
</div>
