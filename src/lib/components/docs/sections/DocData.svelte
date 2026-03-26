<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

  const fullExample = `@DATA(
  // Tier 1 — flat properties first
  app_name = "MyApp"
  version  = "1.0.0"
  port<int> = 8080

  // Tier 2A — table (single colon)
  database:
    host = "db.prod.internal"
    port = 5432
    ssl  = true

  // Tier 2B — array groups (double colon)
  tags:: "web", "api"

  services::
    makeService("auth",    8081),
    makeService("payment", 8082)
)`;
</script>

<section id="data" class="doc-section">
  <h2>@DATA — Two-Tier Ordering</h2>
  <p>
    The @DATA section enforces a strict two-tier structure.
    <strong>Flat properties must always come before grouped data.</strong>
  </p>

  <div class="tier-grid">
    <div class="tier-card">
      <div class="tier-label">Tier 1 — Flat properties</div>
      <pre class="tier-pre"><code>name = "MyApp"
port&lt;int&gt; = 8080
debug&lt;bool&gt; = true</code></pre>
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

  <DocCallout type="warn">
    Do <strong>not</strong> use dot notation for path assignment.
    <code>server.host = "x"</code> is invalid — use table syntax:
    <code>server: host = "x"</code>
  </DocCallout>

  <h3>Complete example</h3>
  <pre><code>{fullExample}</code></pre>
</section>
