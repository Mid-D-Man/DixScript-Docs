<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

  const minimal = `@DATA(
  app_name = "MyApp"
  port<int> = 8080
  debug<bool> = false
)`;

  const fuller = `@CONFIG(
  version  -> "1.0.0"
  features -> "advanced"
)

@ENUMS(
  Env { DEV, STAGING, PROD }
)

@QUICKFUNCS(
  ~service<object>(name, url, timeout<int>) {
    return { name = name, url = url, timeout = timeout }
  }
)

@DATA(
  environment<enum> = Env.PROD

  services::
    service("api",      "https://api.example.com", 30000),
    service("frontend", "https://example.com",     15000)
)`;
</script>

<section id="quickstart" class="doc-section">
  <h2>Quick Start</h2>

  <p>The smallest valid DixScript file — only <code>@DATA</code> is required:</p>
  <pre><code>{minimal}</code></pre>

  <p>Add sections progressively as you need them:</p>
  <pre><code>{fuller}</code></pre>

  <DocCallout type="info">
    Setting <code>features -&gt; "advanced"</code> in @CONFIG unlocks @ENUMS,
    @QUICKFUNCS, @DLM, and @IMPORTS.
  </DocCallout>
</section>
