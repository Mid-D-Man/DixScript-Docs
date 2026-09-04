<!-- src/lib/components/docs/sections/c/DocCEncrypted.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const encC = `// key_path may be NULL to auto-detect a key file next to the .enc file
void* db1 = mdix_load_encrypted("config.mdix.enc", "config.key");
void* db2 = mdix_load_encrypted("config.mdix.enc", NULL);

void* db3 = mdix_load_encrypted_password("config.mdix.enc", "hunter2");

// In-memory bytes — key_file_content and password are both optional,
// but at least one is required; use whichever mode you're in
void* db4 = mdix_load_encrypted_bytes(
    encrypted_bytes, byte_count,
    key_file_content,   /* or NULL */
    password);          /* or NULL */`;

  const encCpp = `auto db1 = mdix::Database::load_encrypted("config.mdix.enc", "config.key");
auto db2 = mdix::Database::load_encrypted("config.mdix.enc"); // key_path defaults to nullopt (auto-detect)

auto db3 = mdix::Database::load_encrypted_password("config.mdix.enc", "hunter2");

// In-memory bytes — key_file_content and password are both optional
// (std::nullopt by default), but at least one is required
std::vector<uint8_t> bytes = /* ... */;
auto db4 = mdix::Database::load_encrypted_bytes(bytes, "keyfilecontent");
auto db5 = mdix::Database::load_encrypted_bytes(bytes, std::nullopt, "hunter2");`;
</script>

<div class="doc-page">
  <h1>Encrypted Loading</h1>
  <p class="page-lead">Part of the <a href="#c-api">C / C++ Runtime API</a>.</p>

  <CodeBlock code={encC} lang="c" />
  <CodeBlock code={encCpp} lang="cpp" />

  <p>
    Hot reload does not support encrypted files — see
    <a href="#c-api--hot-reload">Hot Reload</a> — <code>Watcher</code>/<code>mdix_watcher_*</code>
    always reload through the plaintext loader path, a core Runtime limitation
    rather than something this binding could opt out of.
  </p>
</div>
