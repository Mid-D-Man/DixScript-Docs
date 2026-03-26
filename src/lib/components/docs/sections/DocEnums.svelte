<!-- src/lib/components/docs/sections/DocEnums.svelte -->
<script lang="ts">
  const example = `@ENUMS(
  LogLevel    { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }
  Environment { DEV = 1, STAGING = 2, PROD = 3 }
  Status      { ACTIVE, INACTIVE, PENDING }  // auto: 0, 1, 2
)

@DATA(
  current_env = Environment.PROD
  log_level   = LogLevel.INFO
)`;
</script>

<div class="doc-page">
  <h1>@ENUMS</h1>
  <p class="page-lead">
    Named constant sets. Values auto-increment from 0 if not assigned.
    Enum types are enforced at compile time — invalid values are errors, not runtime surprises.
  </p>
  <pre><code>{example}</code></pre>

  <h2>Rules</h2>
  <ul>
    <li>Reference enum values with dot notation: <code>EnumName.VALUE</code></li>
    <li>Using an undefined value like <code>Status.DELETED</code> is a compile error</li>
    <li>Values auto-assign starting from 0 if no explicit value is given</li>
    <li>Requires <code>features -> "advanced"</code> in <code>@CONFIG</code></li>
  </ul>
</div>
