<script lang="ts">
  const example = `// Password mode — key derived at runtime from user input
@SECURITY(
  encryption -> { mode = "password", algorithm = "aes256-gcm" }
)

// Keyfile mode — key stored in .mdix.key alongside the binary
@SECURITY(
  encryption -> { mode = "keyfile", algorithm = "aes256-gcm" }
)`;
</script>

<section id="security" class="doc-section">
  <h2>@SECURITY</h2>
  <p>Required when using DEncryptor. Specifies key derivation mode and algorithm.</p>
  <pre><code>{example}</code></pre>
</section>
