<!-- src/lib/components/docs/sections/DocData.svelte -->
<script lang="ts">
  const fullExample = `@DATA(
  // Tier 1 — flat properties first
  app_name = "MyApp"
  version  = "1.0.0"
  port     = 8080

  // Tier 2A — table (single colon)
  database:
    host = "db.prod.internal"
    port = 5432
    ssl  = true

  // Tier 2B — inline array group
  tags:: "web", "api"

  // Tier 2B — function-driven array group
  services::
    makeService("auth",    8081),
    makeService("payment", 8082)
)`;
</script>

<div class="doc-page">
  <h1>@DATA</h1>
  <p class="page-lead">
    The only required section. Enforces a strict two-tier structure:
    flat properties must always appear before grouped data.
  </p>

  <div class="tier-grid">
    <div class="tier-card">
      <div class="tier-label">Tier 1 — Flat properties</div>
      <pre class="tier-pre"><code>name = "MyApp"
port = 8080
debug = true</code></pre>
    </div>
    <div class="tier-card">
      <div class="tier-label">Tier 2A — Table (single colon)</div>
      <pre class="tier-pre"><code>server: host = "localhost", port = 8080</code></pre>
    </div>
    <div class="tier-card">
      <div class="tier-label">Tier 2B — Array group (double colon)</div>
      <pre class="tier-pre"><code>tags:: "web", "api", "v1"

items::
  makeItem("I001", "Sword"),
  makeItem("I002", "Shield")</code></pre>
    </div>
  </div>

  <p><strong>Do not</strong> use dot notation for path assignment. <code>server.host = "x"</code> is invalid — use table syntax: <code>server: host = "x"</code></p>

  <h2>Complete Example</h2>
  <pre><code>{fullExample}</code></pre>
</div>
