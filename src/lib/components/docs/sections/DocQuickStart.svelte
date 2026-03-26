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

<section id="quickstart" class="doc-section">
  <h1 class="section-title">
    <span class="title-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"/>
      </svg>
    </span>
    Quick Start
  </h1>

  <p class="section-intro">The smallest valid DixScript file — only <code>@DATA</code> is required:</p>
  <pre><code>{minimal}</code></pre>

  <p>Add sections progressively as you need them:</p>
  <pre><code>{fuller}</code></pre>

  <div class="callout callout--info">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
    </svg>
    <span>
      Setting <code>features -> "advanced"</code> in @CONFIG unlocks @ENUMS,
      @QUICKFUNCS, @DLM, and @IMPORTS.
    </span>
  </div>
</section>
