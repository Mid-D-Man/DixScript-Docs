<!-- src/lib/components/docs/sections/DocSecurity.svelte -->
<script lang="ts">
  const fullSyntax = `@SECURITY(
  encryption -> {
    mode      = "password"          // "password" | "keyfile"
    algorithm = "aes256-gcm"        // see algorithms below
  }

  validation -> {
    checksum_algorithm = "sha256"   // "sha256" | "sha512" | "md5"
    verify_on_load     = true
    strict             = false
  }

  keystore -> {
    key_path    = "/etc/keys/app.mdix.key"
    search_dirs = "/etc/keys,/vault"
  }

  override -> {
    force_recompile  = false
    allow_downgrade  = false
  }

  metadata -> {
    label   = "Production Secrets v2"
    owner   = "platform-team"
    expires = 2026-01-01
  }
)`;

  const passwordMode = `// PASSWORD MODE — key derived from user input at decrypt time.
// No key is stored anywhere. To decrypt, the password must be supplied.
@SECURITY(
  encryption -> {
    mode      = "password"
    algorithm = "aes256-gcm"
  }
)
// Compile: mdix compile secrets.mdix --password
// Decrypt: mdix decrypt secrets.mdix.enc --password`;

  const keyfileMode = `// KEYFILE MODE — a random key is generated and stored in .mdix.key.
// The .mdix.key file must be kept secret and distributed securely.
@SECURITY(
  encryption -> {
    mode      = "keyfile"
    algorithm = "aes256-gcm"
  }
)
// Compile: mdix compile secrets.mdix
// Decrypt: mdix decrypt secrets.mdix.enc --key /path/to/secrets.mdix.key`;

  const argon2Config = `// Advanced: customise Argon2id KDF parameters (password mode only).
// Higher memory/iterations = more brute-force resistant but slower.
@SECURITY(
  encryption -> {
    mode             = "password"
    algorithm        = "aes256-gcm"
    kdf_memory       = 131072      // KB — default 65536 (64 MB)
    kdf_iterations   = 4           // default 3
    kdf_parallelism  = 8           // default 4
  }
)`;

  const validationBlock = `// VALIDATION block — integrity checks on load
@SECURITY(
  encryption -> { mode = "keyfile", algorithm = "chacha20-poly1305" }

  validation -> {
    checksum_algorithm = "sha256"   // algorithm used to hash the source
    verify_on_load     = true       // check hash when decrypting
    strict             = true       // fail if hash mismatch (vs warn)
  }
)`;

  const algorithmTable = [
    { algo: 'aes128-gcm',         bits: 128, type: 'Symmetric',    note: 'Fast. Sufficient for most use cases.' },
    { algo: 'aes256-gcm',         bits: 256, type: 'Symmetric',    note: 'Recommended. Strong, widely supported.' },
    { algo: 'chacha20-poly1305',   bits: 256, type: 'Stream',       note: 'Modern. Preferred on devices without AES hardware acceleration.' },
  ];

  const blockDescriptions = [
    { block: 'encryption', required: 'Required when using DEncryptor', desc: 'Specifies encryption mode, algorithm, and KDF parameters.' },
    { block: 'validation', required: 'Optional',                       desc: 'Configures integrity checking — checksum algorithm and verification behaviour.' },
    { block: 'keystore',   required: 'Optional',                       desc: 'Provides hints for key file discovery — search paths, explicit key location.' },
    { block: 'override',   required: 'Optional',                       desc: 'Compiler behaviour overrides — force recompile, version control.' },
    { block: 'metadata',   required: 'Optional',                       desc: 'Informational fields stored in the key file — label, owner, expiry.' },
  ];
</script>

<div class="doc-page">
  <h1>@SECURITY</h1>
  <p class="page-lead">
    Configures encryption, integrity checking, and key management for files that use
    <code>DEncryptor</code> in <code>@DLM</code>. The section is optional — when
    <code>DEncryptor</code> is present and <code>@SECURITY</code> is absent, the compiler
    auto-fills sensible defaults (<code>keyfile</code> mode, <code>aes256-gcm</code>).
    Blocks within the section are also optional — include only what you need.
  </p>

  <h2>Full Syntax</h2>
  <pre><code>{fullSyntax}</code></pre>

  <h2>Available Blocks</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Block</th><th>When needed</th><th>Description</th></tr></thead>
      <tbody>
        {#each blockDescriptions as b}
          <tr>
            <td><code>{b.block}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{b.required}</td>
            <td style="color:var(--muted-foreground)">{b.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Encryption Algorithms</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Algorithm string</th><th>Key bits</th><th>Type</th><th>Notes</th></tr></thead>
      <tbody>
        {#each algorithmTable as a}
          <tr>
            <td><code>{a.algo}</code></td>
            <td style="color:var(--primary)">{a.bits}</td>
            <td style="color:var(--muted-foreground)">{a.type}</td>
            <td style="color:var(--muted-foreground)">{a.note}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Password Mode</h2>
  <p>
    The encryption key is derived from a user-supplied password at compile and decrypt time
    using <strong>Argon2id</strong> — a memory-hard key derivation function resistant to
    GPU and ASIC brute-force attacks. No key is stored anywhere on disk.
  </p>
  <pre><code>{passwordMode}</code></pre>

  <h2>Keyfile Mode</h2>
  <p>
    A cryptographically random key is generated at compile time and written to a
    <code>.mdix.key</code> file. That file must be kept secret and distributed to
    consumers separately from the encrypted <code>.mdix.enc</code> file.
  </p>
  <pre><code>{keyfileMode}</code></pre>

  <h2>Argon2id KDF Parameters (Password Mode)</h2>
  <p>
    The Argon2id parameters control the time and memory cost of key derivation.
    Increasing them makes brute-force attacks harder but also makes compilation and
    decryption slower. The defaults are intentionally conservative.
  </p>
  <pre><code>{argon2Config}</code></pre>

  <div class="kv-table">
    {#each [
      { key: 'kdf_memory',      type: 'int', desc: 'Memory in KB. Default 65536 (64 MB). Higher = more brute-force resistant.' },
      { key: 'kdf_iterations',  type: 'int', desc: 'Number of passes. Default 3. Higher = slower key derivation.' },
      { key: 'kdf_parallelism', type: 'int', desc: 'Parallel threads. Default 4. Match to your CPU core count.' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Validation Block</h2>
  <p>
    The validation block adds integrity checking. The source data is hashed before
    encryption. On decryption, the hash is recomputed and compared. If it does not
    match and <code>strict = true</code>, decryption fails with an error. With
    <code>strict = false</code>, a warning is issued instead.
  </p>
  <pre><code>{validationBlock}</code></pre>
</div>
