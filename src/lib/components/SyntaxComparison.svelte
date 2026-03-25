<script lang="ts">
  import { onMount } from 'svelte';

  const jsonCode = `{
  "environment": "production",
  "services": [
    {
      "name": "auth-service",
      "image": "auth-service:v1.2.3",
      "port": 8080,
      "replicas": 3,
      "resources": { "cpu": "500m", "memory": "512Mi" },
      "env": {
        "DB_HOST": "postgres.auth.prod.internal",
        "DB_PORT": "5432",
        "DB_USER": "app",
        "REDIS_URL": "redis://auth-cache.prod.internal:6379",
        "LOG_LEVEL": "INFO",
        "ENV": "production"
      },
      "secrets": ["DB_PASSWORD", "JWT_SECRET"],
      "healthcheck": { "path": "/health", "interval": "30s", "timeout": "3s" }
    },
    {
      "name": "payment-service",
      "image": "payment-service:v2.1.0",
      "port": 8081,
      "replicas": 2,
      "resources": { "cpu": "750m", "memory": "1Gi" },
      "env": {
        "DB_HOST": "postgres.payment.prod.internal",
        "DB_PORT": "5432",
        "DB_USER": "app",
        "REDIS_URL": "redis://payment-cache.prod.internal:6379",
        "LOG_LEVEL": "INFO",
        "ENV": "production",
        "STRIPE_URL": "https://api.stripe.com"
      },
      "secrets": ["DB_PASSWORD", "STRIPE_SECRET"],
      "healthcheck": { "path": "/health", "interval": "30s", "timeout": "3s" }
    },
    {
      "name": "user-service",
      "image": "user-service:v3.0.1",
      "port": 8082,
      "replicas": 4,
      "resources": { "cpu": "400m", "memory": "384Mi" },
      "env": {
        "DB_HOST": "postgres.users.prod.internal",
        "DB_PORT": "5432",
        "DB_USER": "app",
        "REDIS_URL": "redis://user-cache.prod.internal:6379",
        "LOG_LEVEL": "INFO",
        "ENV": "production"
      },
      "secrets": ["DB_PASSWORD"],
      "healthcheck": { "path": "/health", "interval": "30s", "timeout": "3s" }
    },
    {
      "name": "orders-service",
      "image": "orders-service:v1.4.0",
      "port": 8083,
      "replicas": 3,
      "resources": { "cpu": "600m", "memory": "768Mi" },
      "env": {
        "DB_HOST": "postgres.orders.prod.internal",
        "DB_PORT": "5432",
        "DB_USER": "app",
        "REDIS_URL": "redis://orders-cache.prod.internal:6379",
        "LOG_LEVEL": "INFO",
        "ENV": "production"
      },
      "secrets": ["DB_PASSWORD"],
      "healthcheck": { "path": "/health", "interval": "30s", "timeout": "3s" }
    },
    {
      "name": "notifications-service",
      "image": "notifications-service:v0.9.5",
      "port": 8084,
      "replicas": 2,
      "resources": { "cpu": "300m", "memory": "256Mi" },
      "env": {
        "DB_HOST": "postgres.notifications.prod.internal",
        "DB_PORT": "5432",
        "DB_USER": "app",
        "REDIS_URL": "redis://notifications-cache.prod.internal:6379",
        "LOG_LEVEL": "INFO",
        "ENV": "production",
        "SMTP_HOST": "smtp.prod.internal",
        "SMTP_PORT": "587"
      },
      "secrets": ["DB_PASSWORD", "SMTP_PASSWORD"],
      "healthcheck": { "path": "/health", "interval": "30s", "timeout": "3s" }
    }
  ],
  "feature_flags": {
    "checkout_v2": false,
    "recommendations": true,
    "beta_banner": false
  },
  "logging": {
    "default_level": "INFO",
    "json_output": true
  }
}`;

  const dixCode = `@CONFIG(
  version     -> "1.0.0"
  description -> "Multi-service production config"
)

@ENUMS(
  Environment { DEV, STAGING, PROD }
)

@QUICKFUNCS(
  ~dbHost<string>(svcName, env<enum>) {
    suffix = env == Environment.PROD     ? "prod.internal"
           : env == Environment.STAGING  ? "staging.internal"
           : "dev.internal"
    return $"postgres.{svcName}.{suffix}"
  }

  ~redisUrl<string>(svcName, env<enum>) {
    suffix = env == Environment.PROD     ? "prod.internal"
           : env == Environment.STAGING  ? "staging.internal"
           : "dev.internal"
    return $"redis://{svcName}-cache.{suffix}:6379"
  }

  ~health<object>() {
    return { path = "/health", interval = "30s", timeout = "3s" }
  }

  ~service<object>(
    name, image, port<int>, replicas<int>,
    cpu, memory, env<enum>, extraEnv, secrets...
  ) {
    return {
      name     = name,   image    = image
      port     = port,   replicas = replicas
      resources = { cpu = cpu, memory = memory }
      env = {
        DB_HOST   = dbHost(name, env)
        DB_PORT   = "5432",  DB_USER = "app"
        REDIS_URL = redisUrl(name, env)
        LOG_LEVEL = "INFO",  ENV     = "production"
        extraEnv...
      }
      secrets     = secrets
      healthcheck = health()
    }
  }
)

@DATA(
  environment<enum> = Environment.PROD

  logging:
    default_level = "INFO"
    json_output   = true

  feature_flags:
    checkout_v2     = false
    recommendations = true
    beta_banner     = false

  services::
    service("auth-service", "auth-service:v1.2.3",
      8080, 3, "500m", "512Mi", environment,
      {}, ["DB_PASSWORD", "JWT_SECRET"]),

    service("payment-service", "payment-service:v2.1.0",
      8081, 2, "750m", "1Gi", environment,
      { STRIPE_URL = "https://api.stripe.com" },
      ["DB_PASSWORD", "STRIPE_SECRET"]),

    service("user-service", "user-service:v3.0.1",
      8082, 4, "400m", "384Mi", environment,
      {}, ["DB_PASSWORD"]),

    service("orders-service", "orders-service:v1.4.0",
      8083, 3, "600m", "768Mi", environment,
      {}, ["DB_PASSWORD"]),

    service("notifications-service", "notifications-service:v0.9.5",
      8084, 2, "300m", "256Mi", environment,
      { SMTP_HOST = "smtp.prod.internal", SMTP_PORT = "587" },
      ["DB_PASSWORD", "SMTP_PASSWORD"])
)`;

  let jsonBytes = 0;
  let dixBytes  = 0;
  let savings   = 0;

  onMount(() => {
    jsonBytes = new Blob([jsonCode]).size;
    dixBytes  = new Blob([dixCode]).size;
    savings   = Math.round((1 - dixBytes / jsonBytes) * 100);
  });

  let jsonCopied = false;
  let dixCopied  = false;

  async function copy(text: string, which: 'json' | 'dix'): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for non-https or older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (which === 'json') {
      jsonCopied = true;
      setTimeout(() => (jsonCopied = false), 2000);
    } else {
      dixCopied = true;
      setTimeout(() => (dixCopied = false), 2000);
    }
  }
</script>

<section class="comparison" id="see-it-in-action">
  <div class="comparison-inner">

    <!-- Header -->
    <div class="section-header">
      <h2>See It In Action</h2>
      <p>
        5 microservices in JSON versus DixScript — same data, dramatically less noise.
        Shared structure (DB defaults, healthchecks, logging) lives in one QuickFunc.
      </p>
    </div>

    <!-- Code panels -->
    <div class="panels">

      <!-- JSON -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
          </div>
          <span class="panel-title">JSON Config</span>
          <button
            class="copy-btn"
            on:click={() => copy(jsonCode, 'json')}
            aria-label="Copy JSON code"
          >
            {#if jsonCopied}
              ✓ Copied
            {:else}
              Copy
            {/if}
          </button>
        </div>
        <pre class="code-block"><code>{jsonCode}</code></pre>
        <div class="panel-footer panel-footer--bad">
          <span class="byte-count">{jsonBytes} bytes</span>
          <span class="byte-sep">·</span>
          <span class="byte-label">every pattern repeated per service</span>
        </div>
      </div>

      <!-- DixScript -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
          </div>
          <span class="panel-title">DixScript (.mdix)</span>
          <button
            class="copy-btn"
            on:click={() => copy(dixCode, 'dix')}
            aria-label="Copy DixScript code"
          >
            {#if dixCopied}
              ✓ Copied
            {:else}
              Copy
            {/if}
          </button>
        </div>
        <pre class="code-block"><code>{dixCode}</code></pre>
        <div class="panel-footer panel-footer--good">
          <span class="byte-count">{dixBytes} bytes</span>
          <span class="byte-sep">·</span>
          <span class="byte-label">patterns factored into one function</span>
        </div>
      </div>

    </div>

    <!-- Caption -->
    <p class="caption">
      Same behavior, less noise. DB host, Redis URL, healthcheck defaults, and log level
      are defined once in <code>~service()</code>. Change the database user or default port?
      Update it once in the function — not in every service block.
    </p>

    <!-- Savings banner -->
    <div class="savings-banner">
      <div class="savings-left">
        <span class="savings-value">{savings}% Smaller</span>
        <span class="savings-desc">
          DixScript saves <strong>{jsonBytes - dixBytes} bytes</strong> across 5 services.
          Scale to 50 services and the gap grows proportionally.
        </span>
      </div>
      <div class="savings-actions">
        <a href="/playground" class="savings-btn savings-btn--primary">Try It</a>
        <a href="/docs" class="savings-btn">Read Docs</a>
      </div>
    </div>

  </div>
</section>

<style>
  .comparison {
    padding: 5rem 1.5rem;
    background: var(--card);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .comparison-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  /* ── Header ── */
  .section-header {
    text-align: center;
  }

  .section-header h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin-bottom: 0.75rem;
  }

  .section-header p {
    font-size: 1rem;
    color: var(--muted-foreground);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.75;
  }

  /* ── Panels ── */
  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .panel {
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .panel-dots {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot-r { background: #f85149; }
  .dot-y { background: #e3b341; }
  .dot-g { background: #3fb950; }

  .panel-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted-foreground);
    flex: 1;
  }

  .copy-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.2rem 0.625rem;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .copy-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .code-block {
    flex: 1;
    margin: 0;
    border: none;
    border-radius: 0;
    background: var(--background);
    font-size: 0.78125rem;
    max-height: 480px;
    overflow-y: auto;
    overflow-x: auto;
  }

  .code-block code {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: var(--foreground);
    white-space: pre;
  }

  .panel-footer {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-top: 1px solid var(--border);
    font-size: 0.8125rem;
    flex-shrink: 0;
  }

  .panel-footer--bad  { background: rgba(185, 84, 53, 0.05); }
  .panel-footer--good { background: rgba(63, 185, 80, 0.05); }

  .byte-count {
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--foreground);
  }

  .byte-sep {
    color: var(--border);
  }

  .byte-label {
    color: var(--muted-foreground);
    font-size: 0.75rem;
  }

  /* ── Caption ── */
  .caption {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.75;
    text-align: center;
    max-width: 720px;
    margin: 0 auto;
  }

  /* ── Savings Banner ── */
  .savings-banner {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .savings-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;
  }

  .savings-value {
    font-family: var(--font-serif);
    font-size: 1.625rem;
    font-weight: 700;
    color: var(--primary);
    flex-shrink: 0;
  }

  .savings-desc {
    font-size: 0.9375rem;
    color: var(--foreground);
    line-height: 1.6;
  }

  .savings-actions {
    display: flex;
    gap: 0.625rem;
    flex-shrink: 0;
  }

  .savings-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.125rem;
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid var(--border);
    color: var(--foreground);
    background: var(--card);
    transition: all 0.15s ease;
    cursor: pointer;
  }

  .savings-btn:hover {
    background: var(--muted);
  }

  .savings-btn--primary {
    background: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  .savings-btn--primary:hover {
    opacity: 0.88;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .panels {
      grid-template-columns: 1fr;
    }

    .comparison {
      padding: 3rem 1rem;
    }

    .savings-banner {
      flex-direction: column;
      align-items: flex-start;
    }

    .savings-actions {
      width: 100%;
    }

    .savings-btn {
      flex: 1;
      justify-content: center;
    }
  }
</style>
