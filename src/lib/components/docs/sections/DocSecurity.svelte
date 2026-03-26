<!-- src/lib/components/docs/sections/DocSecurity.svelte -->
<script lang="ts">
  const example = `// Password mode — key derived from user input at decrypt time
@SECURITY(
  encryption -> { mode = "password", algorithm = "aes256-gcm" }
)

// Keyfile mode — key stored in .mdix.key alongside the binary
@SECURITY(
  encryption -> { mode = "keyfile", algorithm = "aes256-gcm" }
)`;
</script>

<div class="doc-page">
  <h1>@SECURITY</h1>
  <p class="page-lead">
    Required when using <code>DEncryptor</code> in <code>@DLM</code>.
    Specifies how the encryption key is derived or stored.
  </p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'mode',      type: 'string', desc: '"password" — key derived at runtime from user input' },
      { key: 'mode',      type: 'string', desc: '"keyfile" — key stored in a .mdix.key file alongside the binary' },
      { key: 'algorithm', type: 'string', desc: '"aes128-gcm" | "aes256-gcm" | "chacha20-poly1305"' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</div>
