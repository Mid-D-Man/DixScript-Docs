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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'MdixResult.ok(value) / err(message)', d: 'Construct a success or failure result directly.' },
          { m: '.is_success / .is_failure',            d: 'Properties for checking which state a result is in.' },
          { m: '.value / .error',                      d: 'Properties — raise AttributeError if accessed on the wrong state.' },
          { m: '.unwrap()',                             d: 'Return the value, or raise if this is a failure.' },
          { m: '.unwrap_or(default)',                   d: 'Return the value, or default if this is a failure.' },
          { m: '.unwrap_or_else(fn)',                    d: 'Return the value, or compute a fallback from the error via fn.' },
          { m: '.map(fn)',                               d: 'Transform the value if success, pass the failure through unchanged.' },
          { m: '.and_then(fn)',                          d: 'Chain another Result-returning operation, short-circuiting on failure.' },
          { m: '.ensure(pred, message)',                 d: 'Downgrade a success to a failure if pred(value) is False.' },
          { m: '.or_(fallback_result)',                  d: 'Return this result if success, otherwise fallback_result.' },
          { m: '.fold(on_success, on_failure)',           d: 'Collapse to a single value by calling whichever branch applies.' },
          { m: '.tap(fn) / .tap_error(fn)',               d: 'Side-effect only, on success or failure respectively — returns self unchanged.' },
          { m: '.or_raise()',                            d: 'Same as unwrap() — raise on failure, return the value on success.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
