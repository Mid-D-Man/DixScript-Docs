<!-- src/lib/components/docs/sections/csharp/DocCSharpDynamicAccess.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  server:
    host = "0.0.0.0"
    port<int> = 8080

  enemies:: "Goblin", "Orc", "Dragon"
)`;

  const dynamicApi = `// AsDynamic() gives you dynamic member + index access when you don't
// want to declare a POCO for a one-off read.
dynamic cfg = db.AsDynamic();

string host = cfg.server.host;
int    port = cfg.server.port;
string firstEnemyName = cfg.enemies[0];

MdixResult<string> json = ((MdixDynamic)cfg).ToJson();

// A missing or misspelled path does NOT throw — TryGetMember always
// succeeds and just resolves to null (or 0/false for a numeric/bool
// access, since the type comes from what's actually stored at the
// path, which doesn't exist here to tell it). A typo silently
// produces a default value instead of an error:
string typo = cfg.sever.host;  // "sever" — null, no exception, no warning`;
</script>

<div class="doc-page">
  <h1>Dynamic Access</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
    <code>MdixDynamic</code> implements <code>DynamicObject</code> for quick
    exploratory reads — property and index access resolve against the
    underlying <code>DixData</code> at runtime.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={dynamicApi} lang="csharp" />

  <div class="tip-callout">
    <strong>When dynamic actually earns its keep</strong>
    <ul>
      <li><strong>Use <code>AsDynamic()</code></strong> for a REPL/scratch script, a debugger watch expression, or genuinely exploratory code where you don't yet know the shape of the data you're looking at.</li>
      <li><strong>Use typed <code>Get&lt;T&gt;</code> or <a href="#csharp-api--poco">POCO deserialization</a> for anything that ships</strong> — and specifically because of what the example above shows: a typo'd path doesn't throw, it silently resolves to <code>null</code>/<code>0</code>/<code>false</code>. That's a materially worse failure mode than an exception — a missing config value can flow deep into your program before anything notices, instead of failing loudly at the point of the typo.</li>
      <li><strong>Avoid</strong> passing an <code>MdixDynamic</code> across a method boundary as <code>dynamic</code> — cast it back to a concrete type (or read the values out) at the edge of whatever scratch code is using it, so the rest of the call graph stays statically typed.</li>
    </ul>
  </div>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Member</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'db.AsDynamic()',           d: 'Wrap a loaded MdixDatabase as an MdixDynamic.' },
          { m: 'cfg.path.segment',         d: 'Dynamic member access — resolves against the underlying DixData at runtime.' },
          { m: 'cfg.array[i]',             d: 'Dynamic index access into an array-valued path.' },
          { m: '((MdixDynamic)cfg).ToJson()', d: 'Cast back to the concrete type to reach non-dynamic members like export.' },
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
