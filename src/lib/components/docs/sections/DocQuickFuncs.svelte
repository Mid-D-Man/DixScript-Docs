<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

  const example = `@QUICKFUNCS(
  // Returns an object — shape defined once, reused everywhere
  ~makeServer<object>(host<string>, port<int>, ssl<bool>) {
    return {
      host = host
      port = port
      ssl  = ssl
    }
  }

  // Conditional expression
  ~envLabel<string>(env<enum>) {
    return env == Env.PROD ? "production" : "development"
  }

  // Formula-based pricing — change here, all callers update
  ~item<object>(name, damage<int>) {
    return {
      name      = name
      damage    = damage
      sellPrice = damage * 2
      buyPrice  = damage * 8
    }
  }
)`;

  const scopeExample = `// Exported — importable from other files via alias
~sharedHelper => global(x<int>) { return x * 2 }

// Internal — only usable within this file
~localHelper(x<int>) { return x + 1 }`;
</script>

<section id="quickfuncs" class="doc-section">
  <h2>@QUICKFUNCS</h2>
  <p>
    Compile-time functions — they execute at parse time with zero runtime overhead.
    Define your data shape once, call it everywhere.
  </p>
  <pre><code>{example}</code></pre>

  <h3>Scope declaration</h3>
  <p>
    Functions with <code>=&gt; global</code> are exported and importable by other files.
    The default scope is internal to the current file.
  </p>
  <pre><code>{scopeExample}</code></pre>

  <DocCallout type="warn">
    Maximum recursion depth is enforced at compile time to prevent infinite loops.
  </DocCallout>
</section>
