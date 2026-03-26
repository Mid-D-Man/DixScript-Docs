<!-- src/lib/components/docs/sections/DocDLM.svelte -->
<script lang="ts">
  const example = `@DLM(
  DCompressor.gzip    // gzip | bzip2 | lzma
  DEncryptor.aes256   // aes128 | aes256 | chacha20 | xor
  DAuditor.enhanced   // diy | enhanced
)`;
</script>

<div class="doc-page">
  <h1>@DLM — Data Lifecycle Modules</h1>
  <p class="page-lead">
    Attach compression, encryption, and auditing to compiled output.
    Modules execute in declaration order: compress → encrypt → audit.
  </p>
  <pre><code>{example}</code></pre>

  <h2>Compressors</h2>
  <div class="kv-table">
    {#each [
      { key: 'DCompressor.gzip',  desc: 'Standard gzip — fast, widely supported' },
      { key: 'DCompressor.bzip2', desc: 'Better compression ratio than gzip' },
      { key: 'DCompressor.lzma',  desc: 'Best compression — slower, best for large configs' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 200px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Encryptors</h2>
  <div class="kv-table">
    {#each [
      { key: 'DEncryptor.xor',      desc: 'XOR obfuscation — fast, not cryptographically secure' },
      { key: 'DEncryptor.aes128',   desc: 'AES-128 encryption' },
      { key: 'DEncryptor.aes256',   desc: 'AES-256 — recommended for sensitive data' },
      { key: 'DEncryptor.chacha20', desc: 'ChaCha20 stream cipher — fast and modern' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 200px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Output Files</h2>
  <div class="kv-table">
    {#each [
      { key: '.mdix.enc', desc: 'Compressed and/or encrypted binary output' },
      { key: '.mdix.key', desc: 'Key file for decryption (keyfile mode only)' },
      { key: '.mdix.au',  desc: 'Audit trail log (DAuditor only)' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 200px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</div>
