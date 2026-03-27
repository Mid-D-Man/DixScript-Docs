<!-- src/lib/components/docs/sections/DocDLM.svelte -->
<script lang="ts">
  const exampleSection = `@DLM(
  DCompressor.gzip    // compress first
  DEncryptor.aes256   // then encrypt
  DAuditor.enhanced   // record compilation trail
)`;

  const compressorEx = `// Single compressor
@DLM(
  DCompressor.gzip
)

// Compress then encrypt (most common combination)
@DLM(
  DCompressor.lzma
  DEncryptor.aes256
)`;

  const auditorEx = `// Auditor alone — produces a .mdix.au file without encryption
@DLM(
  DAuditor.diy
)

// Auditor with encryption pipeline
@DLM(
  DCompressor.gzip
  DEncryptor.aes256
  DAuditor.enhanced
)`;

  const keyFileContent = `// Example .mdix.key content (auto-generated, do not edit manually)
@KEY_CONFIG(
  version     -> "1.0.0",
  key_type    -> "keyfile",
  generated   -> "2025-06-01T08:30:00Z",
  source_file -> "secrets.mdix"
)

@KEY_PIPELINE(
  modules  -> "DCompressor.gzip,DEncryptor.aes256",
  reversal -> "DEncryptor.aes256,DCompressor.gzip"
)

@KEY_ENCRYPTION(
  algorithm      -> "aes256-gcm",
  key_length     -> 32,
  iv             -> "base64encodedIV==",
  security_level -> "HIGH",
  key_data       -> "base64encodedEncryptionKey=="   // absent in password mode
)

@KEY_COMPRESSION(
  algorithm       -> "gzip",
  original_size   -> 2048,
  compressed_size -> 891
)

@KEY_FILE_INFO(
  original_size   -> 2048,
  compressed_size -> 891,
  encrypted_size  -> 907,
  created         -> "2025-06-01T08:30:00Z",
  source_file     -> "secrets.mdix",
  output_file     -> "secrets.mdix.enc"
)`;

  const auFileContent = `// Example .mdix.au content (auto-generated, append-only)
// DixScript Audit File v1.0.0
// Generated: 2025-06-01T08:30:00Z
// Source: config.mdix

@AUDIT_CONFIG(
  source_file -> "config.mdix",
  max_entries -> 100,
  format      -> "structured",
  created     -> "2025-06-01T08:30:00Z"
)

// Each compilation appends a new entry:
compilation_1:
  index             -> 1,
  compilation_id    -> "a3f7b2c1",
  timestamp         -> "2025-06-01T08:30:05Z",
  source_checksum   -> "sha256:abc123...",
  status            -> "SUCCESS",
  modules_executed  -> "DCompressor.gzip,DEncryptor.aes256",
  execution_time_ms -> 45.23,
  changes_summary   -> "Initial compilation"

compilation_2:
  index             -> 2,
  compilation_id    -> "d9e4f1a8",
  timestamp         -> "2025-06-02T09:15:22Z",
  source_checksum   -> "sha256:def456...",
  status            -> "SUCCESS",
  modules_executed  -> "DCompressor.gzip,DEncryptor.aes256",
  execution_time_ms -> 38.14,
  changes_summary   -> "1 modified, DATA: entries"`;

  const projectStructure = `project/
├── src/
│   └── ...
│
├── config/
│   ├── app.mdix               ← source (commit this)
│   ├── app.mdix.au            ← audit trail (commit — readonly after write)
│   └── ...
│
├── dist/
│   ├── app.mdix.enc           ← encrypted output (commit or distribute)
│   └── ...
│
└── secrets/                   ← GITIGNORE THIS DIRECTORY
    └── app.mdix.key           ← encryption key (never commit)`;

  const readonlyNote = `// All DLM output files are set read-only by the compiler immediately
// after writing. Under normal circumstances only the compiler writes them.
//
// If you need to manually delete and regenerate them:
//   chmod +w app.mdix.enc && rm app.mdix.enc   (Unix)
//   attrib -R app.mdix.enc && del app.mdix.enc (Windows)
//
// The compiler unlocks, overwrites, then re-locks in a single atomic step.`;
</script>

<div class="doc-page">
  <h1>@DLM — Data Lifecycle Modules</h1>
  <p class="page-lead">
    Attach compression, encryption, and auditing to compiled output.
    Modules execute in declaration order: the output of each feeds into the next.
    The typical pipeline is: compress → encrypt → audit.
  </p>
  <pre><code>{exampleSection}</code></pre>

  <h2>Compressors</h2>
  <div class="kv-table">
    {#each [
      { key: 'DCompressor.gzip',  desc: 'Standard gzip. Fast, widely supported. Best general-purpose choice.' },
      { key: 'DCompressor.bzip2', desc: 'Better compression ratio than gzip at the cost of speed.' },
      { key: 'DCompressor.lzma',  desc: 'Highest compression ratio. Slower — best for large configs.' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 220px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
  <pre><code>{compressorEx}</code></pre>

  <h2>Encryptors</h2>
  <div class="kv-table">
    {#each [
      { key: 'DEncryptor.xor',      desc: 'XOR obfuscation only. Fast, not cryptographically secure. Use for obfuscation, not secrets.' },
      { key: 'DEncryptor.aes128',   desc: 'AES-128-GCM authenticated encryption.' },
      { key: 'DEncryptor.aes256',   desc: 'AES-256-GCM. Recommended for sensitive data.' },
      { key: 'DEncryptor.chacha20', desc: 'ChaCha20-Poly1305. Preferred on hardware without AES acceleration.' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 220px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Auditors</h2>
  <div class="kv-table">
    {#each [
      { key: 'DAuditor.diy',      desc: 'Simple structured audit log. Records compilation ID, checksum, status, modules executed, and timing.' },
      { key: 'DAuditor.enhanced', desc: 'Full audit with AST snapshot and smart diff against the previous compilation. Shows exactly what changed between compilations.' },
    ] as row}
      <div class="kv-row" style="grid-template-columns: 220px 1fr;">
        <code class="kv-key">{row.key}</code>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
  <pre><code>{auditorEx}</code></pre>

  <h2>Output Files</h2>
  <p>
    The compiler produces sidecar files alongside the source <code>.mdix</code> file.
    All output files are set <strong>read-only immediately after writing</strong>.
    Under normal circumstances only the compiler should write them.
  </p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>File</th><th>Produced when</th><th>Purpose</th></tr></thead>
      <tbody>
        {#each [
          { file: '.mdix.enc', when: 'DEncryptor is in @DLM', purpose: 'The compressed and/or encrypted binary output. Safe to distribute.' },
          { file: '.mdix.key', when: 'DEncryptor is in @DLM', purpose: 'Contains the encryption key (keyfile mode) or KDF parameters (password mode). Keep secret.' },
          { file: '.mdix.au',  when: 'DAuditor is in @DLM',   purpose: 'Append-only audit trail. Records every compilation with checksums, timing, and diffs.' },
        ] as row}
          <tr>
            <td><code>{row.file}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.when}</td>
            <td style="color:var(--muted-foreground)">{row.purpose}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>The Key File</h2>
  <p>
    The <code>.mdix.key</code> file contains everything the decryption pipeline needs:
    the encryption algorithm, the initialisation vector, key material (in keyfile mode),
    or Argon2id parameters (in password mode). It is written in DixScript's own syntax
    and is human-readable, but it is not a <code>.mdix</code> source file — it is a
    compiler artifact. <strong>Treat it like a private key. Never commit it to source
    control.</strong>
  </p>
  <pre><code>{keyFileContent}</code></pre>

  <h2>The Audit File</h2>
  <p>
    The <code>.mdix.au</code> file is an append-only log. Each compilation adds one
    entry. The file is locked read-only between compilations. When the entry count
    reaches the configured maximum (default 100), the file is archived with a timestamp
    suffix and a new one is started. The enhanced auditor also embeds a base64-encoded
    AST snapshot in each entry for full diffing capability.
  </p>
  <pre><code>{auFileContent}</code></pre>

  <h2>File Permissions</h2>
  <pre><code>{readonlyNote}</code></pre>

  <h2>Recommended Project Structure</h2>
  <p>
    Keep your <code>.mdix</code> source and the <code>.mdix.au</code> audit trail in
    version control. Keep the <code>.mdix.enc</code> encrypted output in a distribution
    folder. Never commit the <code>.mdix.key</code> file — store it in a secrets manager,
    environment variable, or secure vault.
  </p>
  <pre><code>{projectStructure}</code></pre>
</div>
