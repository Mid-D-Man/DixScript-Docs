<!-- src/lib/components/docs/sections/DocBuiltinDix.svelte -->
<script lang="ts">
  const methods = [
    { name: 'Dix.Log(msg)',         desc: 'Log at Info level' },
    { name: 'Dix.LogInfo(msg)',     desc: 'Log informational message' },
    { name: 'Dix.LogWarning(msg)',  desc: 'Log warning message' },
    { name: 'Dix.LogError(msg)',    desc: 'Log error message' },
    { name: 'Dix.LogDebug(msg)',    desc: 'Log debug message (debug mode only)' },
    { name: 'Dix.LogVerbose(msg)',  desc: 'Log verbose message (verbose debug mode only)' },
    { name: 'Dix.Assert(cond, msg)',desc: 'Throw compile error if condition is false' },
    { name: 'Dix.Print(msg)',       desc: 'Print directly to console output' },
    { name: 'Dix.Format(fmt, ...)', desc: 'Format string using {0} {1} placeholders' },
    { name: 'Dix.Join(sep, ...)',   desc: 'Join multiple values into a string with separator' },
  ];
</script>

<div class="doc-page">
  <h1>Dix Utilities</h1>
  <p class="page-lead">
    Logging, assertions, and string utilities. These execute at compile time
    and are useful for debugging config generation. Log output requires
    <code>debug_mode -> "regular"</code> (or <code>"verbose"</code>) in <code>@CONFIG</code>.
  </p>

  <pre><code>Dix.Assert(port > 0, "Port must be positive")
Dix.Assert(maxRetries <= 10, "Max retries seems high — intentional?")

label = Dix.Format("Loading {0} config v{1}", environment, version)
csv   = Dix.Join(", ", host, port, dbName)</code></pre>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each methods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Format Placeholders</h2>
  <p>
    <code>Dix.Format</code> uses zero-indexed <code>{'{0}'}</code> placeholders.
    Extra arguments beyond the placeholder count are ignored.
  </p>
  <pre><code>msg = Dix.Format("Service {0} on port {1}", name, port)
// → "Service auth on port 8080"</code></pre>
</div>
