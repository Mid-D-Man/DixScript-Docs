<!-- src/lib/components/docs/sections/DocQuickFuncs.svelte -->
<script lang="ts">
  const example = `@QUICKFUNCS(
  // Shape defined once — reused everywhere
  ~makeServer(host, port, ssl) {
    return {
      host = host
      port = port
      ssl  = ssl
    }
  }

  // Ternary expression
  ~envLabel(env) {
    return env == Env.PROD ? "production" : "development"
  }

  // Formula-based pricing
  ~item(name, damage) {
    return {
      name      = name
      damage    = damage
      sellPrice = damage * 2
      buyPrice  = damage * 8
    }
  }
)`;

  const scopeExample = `// Exported — importable from other files via alias
~sharedHelper => global(x) { return x * 2 }

// Internal — only usable within this file (default)
~localHelper(x) { return x + 1 }`;
</script>

<div class="doc-page">
  <h1>@QUICKFUNCS</h1>
  <p class="page-lead">
    Compile-time functions that execute at parse time with zero runtime overhead.
    Define your data shape once, call it everywhere. Requires <code>features -> "advanced"</code>.
  </p>
  <pre><code>{example}</code></pre>

  <h2>Scope</h2>
  <p>
    Functions with <code>=> global</code> are exported and importable by other files.
    The default scope is internal to the current file.
  </p>
  <pre><code>{scopeExample}</code></pre>

  <h2>Rules</h2>
  <ul>
    <li>Maximum recursion depth is enforced at compile time</li>
    <li>Functions can call other functions defined in the same section</li>
    <li>Type annotations are optional — <code>(x)</code> and <code>(x&lt;int&gt;)</code> are both valid</li>
  </ul>
</div>
