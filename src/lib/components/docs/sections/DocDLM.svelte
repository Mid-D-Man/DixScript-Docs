<script lang="ts">
  const example = `@DLM(
  DCompressor.gzip    // gzip | bzip2 | lzma
  DEncryptor.aes256   // aes128 | aes256 | chacha20 | xor
  DAuditor.enhanced   // diy | enhanced
)`;
</script>

<section id="dlm" class="doc-section">
  <h2>@DLM — Data Lifecycle Modules</h2>
  <p>
    Attach compression, encryption, and auditing to compiled output.
    Modules execute in order: compress → encrypt → audit.
  </p>
  <pre><code>{example}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'DCompressor.gzip',    desc: 'Standard gzip — fast, widely supported'              },
      { key: 'DCompressor.bzip2',   desc: 'Better compression ratio than gzip'                  },
      { key: 'DCompressor.lzma',    desc: 'Best compression — slower, best for large configs'   },
      { key: 'DEncryptor.xor',      desc: 'XOR obfuscation — fast, not cryptographically secure'},
      { key: 'DEncryptor.aes128',   desc: 'AES-128 encryption'                                  },
      { key: 'DEncryptor.aes256',   desc: 'AES-256 — recommended for sensitive data'            },
      { key: 'DEncryptor.chacha20', desc: 'ChaCha20 stream cipher — fast and modern'            },
      { key: 'DAuditor.enhanced',   desc: 'Track access, changes, timestamps'                   },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span style="grid-column: 2 / 4" class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h3>Output files</h3>
  <div class="kv-table">
    {#each [
      { key: '.mdix.enc', desc: 'Compressed and/or encrypted binary output'   },
      { key: '.mdix.key', desc: 'Key file for decryption (keyfile mode only)' },
      { key: '.mdix.au',  desc: 'Audit trail log (DAuditor only)'             },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span style="grid-column: 2 / 4" class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</section>
