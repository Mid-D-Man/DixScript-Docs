<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

  const example = `@ENUMS(
  LogLevel    { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }
  Environment { DEV = 1, STAGING = 2, PROD = 3 }
  Status      { ACTIVE, INACTIVE, PENDING }  // auto: 0, 1, 2
)

@DATA(
  current_env<enum> = Environment.PROD
  log_level<enum>   = LogLevel.INFO
)`;
</script>

<section id="enums" class="doc-section">
  <h2>@ENUMS</h2>
  <p>
    Named constant sets. Values auto-increment from 0 if not assigned.
    Enum types are enforced at compile time — invalid values are errors,
    not runtime surprises.
  </p>
  <pre><code>{example}</code></pre>

  <DocCallout type="info">
    Enums are referenced with dot notation: <code>EnumName.VALUE</code>.
    Using an undefined value like <code>Status.DELETED</code> is a compile error.
  </DocCallout>
</section>
