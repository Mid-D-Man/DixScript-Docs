<!-- src/lib/components/docs/sections/DocQuickStart.svelte -->
<script lang="ts">
  const minimal = `@DATA(
  app_name = "MyApp"
  port     = 8080
  debug    = false
)`;

  const fuller = `@CONFIG(
  version  -> "1.0.0"
  features -> "advanced"
)

@ENUMS(
  Env { DEV, STAGING, PROD }
)

@QUICKFUNCS(
  ~service(name, url, timeout) {
    return { name = name, url = url, timeout = timeout }
  }
)

@DATA(
  environment = Env.PROD

  services::
    service("api",      "https://api.example.com", 30000),
    service("frontend", "https://example.com",     15000)
)`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>

  <p class="page-lead">
    The smallest valid DixScript file only requires a <code>@DATA</code> section.
    Add other sections progressively as your needs grow.
  </p>

  <h2>Minimal File</h2>
  <p>This is a valid, complete DixScript file:</p>
  <pre><code>{minimal}</code></pre>

  <h2>With Advanced Features</h2>
  <p>
    Set <code>features -> "advanced"</code> in <code>@CONFIG</code> to unlock
    <code>@ENUMS</code>, <code>@QUICKFUNCS</code>, <code>@DLM</code>, and <code>@IMPORTS</code>.
  </p>
  <pre><code>{fuller}</code></pre>
</div>
