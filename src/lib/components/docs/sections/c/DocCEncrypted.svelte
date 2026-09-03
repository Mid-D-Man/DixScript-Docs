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

auto db3 = mdix::Database::load_encrypted_password("config.mdix.enc", "hunter2");`;
</script>

<div class="doc-page">
  <h1>Encrypted Loading</h1>
  <p class="page-lead">Part of the <a href="#c-api">C / C++ Runtime API</a>.</p>

  <CodeBlock code={encC} lang="c" />
  <CodeBlock code={encCpp} lang="cpp" />

  <div class="tip-callout">
    <strong>The C++ wrapper doesn't cover in-memory encrypted bytes</strong>
    <ul>
      <li><code>mdix::Database</code> exposes <code>load_encrypted()</code> and <code>load_encrypted_password()</code>, but there's no C++ equivalent of <code>mdix_load_encrypted_bytes()</code> — checked directly against <code>mdix.hpp</code>'s factory functions, it isn't there.</li>
      <li>If you need to load encrypted data already in memory (not a file on disk), call <code>::mdix_load_encrypted_bytes()</code> directly and wrap the returned handle with <code>mdix::Database::adopt(handle)</code> — that takes ownership the same way <code>Watcher::check_and_reload()</code>'s result does internally.</li>
    </ul>
  </div>

  <p>
    Hot reload does not support encrypted files — see
    <a href="#c-api--hot-reload">Hot Reload</a> — <code>Watcher</code>/<code>mdix_watcher_*</code>
    always reload through the plaintext loader path, a core Runtime limitation
    rather than something this binding could opt out of.
  </p>
</div>

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
