<!-- src/lib/components/docs/sections/DocData.svelte -->
<script lang="ts">
  const fullExample = `@DATA(
  // ── Tier 1: flat properties ───────────────────────────────
  app_name              = "MyApp"          // bare string
  version               = "1.0.0"
  port<int>             = 8080             // explicit type annotation
  debug<bool>           = false
  ratio<float>          = 0.5f
  score<double>         = 3.14
  tag<hex>              = 0xFF5733
  colour                = #3A9BDC          // hex colour literal
  created<date>         = 2025-01-15
  updated<timestamp>    = 2025-01-15T10:30:00Z
  thumbnail<blob>       = b:("SGVsbG8=")   // base64 binary
  pattern<regex>        = r:("^[a-z]+$")   // regex pattern
  coords<tuple>         = t:(10, 20, "north")  // max 6 elements
  user_env<enum>        = Environment.PROD // enum reference
  nothing               = null

  // QuickFunc call as a value
  primary_server        = makeServer("api.local", 8080)
  feature_count         = tierLimit(Tier.PRO)

  // ── Tier 2A: table (single colon) ─────────────────────────
  database:
    host    = "db.prod.internal"
    port    = 5432
    ssl     = true
    timeout = 30000

  logging:
    level  = "INFO"
    pretty = true

  // ── Tier 2B: inline array (double colon) ──────────────────
  tags:: "web", "api", "v1"

  // ── Tier 2B: QuickFunc-driven array ───────────────────────
  servers::
    makeServer("primary.local",  8080),
    makeServer("replica.local",  8081)

  users::
    makeUser("alice", Role.ADMIN),
    makeUser("bob",   Role.USER)
)`;

  const typeAnnotationExample = `@DATA(
  // Type annotations are OPTIONAL — the compiler infers types
  // These two lines are equivalent:
  port = 8080
  port<int> = 8080

  // Annotations are useful when you want the compiler
  // to enforce a specific type and reject mismatches:
  api_key<string> = "abc123"    // enforced as string
  limit<int>      = 100         // enforced as int — 100.5 would fail

  // Enum type annotation:
  level<enum>     = LogLevel.INFO   // enforced as enum type

  // Without annotation, any compatible value is accepted
  flexible = 42          // inferred as int
  flexible = 3.14        // also fine — now inferred as double
)`;

  const commaRulesExample = `// OPTIONAL COMMAS — between flat properties, table entries, array items:
@DATA(
  a = 1        // comma optional between flat properties
  b = 2
  c = 3

  server:
    host = "localhost"   // comma optional between table fields
    port = 8080
    ssl  = false

  tags:: "x" "y" "z"    // comma optional between array items

  // REQUIRED COMMAS — inside function calls, array literals, objects, tuples:
  result  = myFunc(a, b, c)              // commas required in call args
  arr     = [1, 2, 3]                    // commas required in array literal
  obj     = { x = 1, y = 2, z = 3 }     // commas required in object literal
  pos     = t:(10, 20, "north")          // commas required in tuple
)`;

  const nestedTableExample = `@DATA(
  // Tables can reference QuickFunc return values:
  auth:
    config = buildAuthConfig(Environment.PROD)
    secret = "replace_in_deployment"

  // Arrays of objects constructed inline:
  routes::
    { path = "/health", method = "GET",  auth = false },
    { path = "/api",    method = "POST", auth = true  }
)`;
</script>

<div class="doc-page">
  <h1>@DATA</h1>
  <p class="page-lead">
    Holds your configuration data. While the compiler warns when this section is absent,
    it is technically optional — every DixScript section is. <code>@DATA</code> enforces
    a strict two-tier ordering: all flat properties must appear before any grouped data.
  </p>

  <h2>Complete Example</h2>
  <pre><code>{fullExample}</code></pre>

  <h2>Type Annotations</h2>
  <p>
    Type annotations (<code>&lt;type&gt;</code>) are always optional on property assignments.
    The compiler infers types from assigned values. Add an annotation when you want the
    compiler to enforce a specific type and reject values that do not match.
  </p>
  <pre><code>{typeAnnotationExample}</code></pre>

  <p>Valid annotation types:</p>
  <div class="kv-table">
    {#each [
      { key: '<int>',       desc: 'Signed 32-bit integer. Rejects floats and strings.' },
      { key: '<float>',     desc: 'Single-precision float. Value must carry the f suffix.' },
      { key: '<double>',    desc: 'Double-precision float.' },
      { key: '<string>',    desc: 'Text value. Rejects numbers and booleans.' },
      { key: '<bool>',      desc: 'true or false only.' },
      { key: '<enum>',      desc: 'Value must be a valid reference to a declared enum member.' },
      { key: '<hex>',       desc: 'Hexadecimal integer literal (0xFF form).' },
      { key: '<blob>',      desc: 'Base64-encoded binary, b:("…") constructor.' },
      { key: '<regex>',     desc: 'Regular expression, r:("…") constructor.' },
      { key: '<tuple>',     desc: 'Mixed-type value, t:(…) constructor. Max 6 elements.' },
      { key: '<array>',     desc: 'Homogeneous array literal [1, 2, 3].' },
      { key: '<object>',    desc: 'Inline object literal { key = val }.' },
      { key: '<date>',      desc: 'ISO 8601 date: 2025-01-15.' },
      { key: '<timestamp>', desc: 'ISO 8601 timestamp: 2025-01-15T10:30:00Z.' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 140px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>QuickFunc Calls as Values</h2>
  <p>
    Any flat property value, table field value, or array item can be the result of a
    QuickFunc call. Functions are resolved at compile time — no function calls appear
    in the output.
  </p>
  <pre><code>{nestedTableExample}</code></pre>

  <h2>Comma Rules</h2>
  <p>
    Commas between entries are optional wherever DixScript uses a line-per-item style.
    They are required inside function argument lists, array literals, object literals,
    and tuple constructors.
  </p>
  <pre><code>{commaRulesExample}</code></pre>

  <h2>Tier Structure Reference</h2>
  <div class="tier-grid">
    <div class="tier-card">
      <div class="tier-label">Tier 1 — Flat properties</div>
      <pre class="tier-pre"><code>name    = "MyApp"
port    = 8080
debug   = true
derived = computedValue(arg)</code></pre>
    </div>
    <div class="tier-card">
      <div class="tier-label">Tier 2A — Table (single colon)</div>
      <pre class="tier-pre"><code>database:
  host = "localhost"
  port = 5432
  ssl  = true</code></pre>
    </div>
    <div class="tier-card">
      <div class="tier-label">Tier 2B — Array group (double colon)</div>
      <pre class="tier-pre"><code>// Inline literals
tags:: "web", "api", "v1"

// QuickFunc-driven
items::
  makeItem("I001", "Sword"),
  makeItem("I002", "Shield")</code></pre>
    </div>
  </div>

  <p>
    <strong>Do not</strong> use dot notation for nested assignment.
    <code>server.host = "x"</code> is invalid — use table syntax instead:
    <code>server: host = "x"</code>.
    Flat properties must always appear before any table or array group in the section.
  </p>

  <h2>Tuples</h2>
  <p>
    Tuples hold a fixed-length sequence of mixed-type values using the
    <code>t:(…)</code> constructor. A maximum of six elements is allowed.
    Commas between elements are required.
  </p>
  <pre><code>position  = t:(10, 20)
named_pos = t:(10, 20, "north")
full      = t:(1, 2.5f, "text", true, #FF0000, null)  // max 6</code></pre>
</div>
