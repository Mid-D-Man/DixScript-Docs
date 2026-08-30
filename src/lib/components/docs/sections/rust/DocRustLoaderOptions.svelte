<!-- src/lib/components/docs/sections/rust/DocRustLoaderOptions.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DLM(
  DEncryptor.aes256
)

@DATA(
  api:
    key    = "sk_live_51H8x..."
    secret = "whsec_9f3e2a..."
)`;

  const loadOptionsApi = `use dixscript::Runtime::DixLoadOptions;
use std::time::Duration;

fn load_options_examples() {
    // Default — no encryption, auto-locate key if needed
    let default_opts = DixLoadOptions::new();

    // Password mode
    let pw_opts = DixLoadOptions::with_password("my-strong-password");

    // Explicit key file
    let key_opts = DixLoadOptions::with_key_file("/vault/app.mdix.key");

    // Key search paths — checked in order when auto-locating
    let search_opts = DixLoadOptions::with_key_search_paths(vec![
        "/etc/myapp/keys".into(),
        "/vault/keys".into(),
    ]);

    // Direct key file content (requires security acknowledgment)
    let direct = DixLoadOptions::with_key_content(
        vault_client_fetch_key(),
        true,  // acknowledge_security_risk — only use from a trusted vault
    ).expect("acknowledged");

    // URL-based key loading (requires HTTPS + acknowledgment)
    let url = DixLoadOptions::with_key_url(
        "https://vault.internal/secret/app.mdix.key",
        true,
    ).expect("https + acknowledged");

    // Fine-grained control via field mutation:
    let mut opts = DixLoadOptions::new();
    opts.validate_checksums       = true;
    opts.throw_on_missing_sections = false;
    opts.output_directory          = Some("/tmp/output".into());
}

fn vault_client_fetch_key() -> String { String::new() } // placeholder`;
</script>

<div class="doc-page">
  <h1>DixLoadOptions — Configuring the Loader</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Passed to every
    <a href="#rust-api--loader"><code>DixLoader</code></a> call to control
    decryption mode, key resolution, and validation behavior.
  </p>

  <h2>Example .mdix file</h2>
  <p>
    A source file with a <code>@DLM</code> block requesting encryption
    compiles to <code>secrets.mdix.enc</code> plus a separate key file —
    the options below control how the loader finds that key again on the
    way back in.
  </p>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={loadOptionsApi} lang="rust" />

  <div class="tip-callout">
    <strong>Which key-resolution mode?</strong>
    <ul>
      <li><strong>Use <code>with_key_file</code></strong> (or the default auto-locate, which checks alongside the <code>.enc</code> file first) for the common case — a key file shipped separately from the encrypted config, e.g. mounted into a container at deploy time.</li>
      <li><strong>Use <code>with_password</code></strong> when there's a human typing it in, or it comes from an env var / secrets manager as a single string rather than a file.</li>
      <li><strong>Use <code>with_key_content</code> / <code>with_key_url</code> only from a trusted vault client</strong> — both require <code>acknowledge_security_risk = true</code> for a reason: the key material passes through your process's memory as a plain <code>String</code> either way, sourced from wherever you fetched it. The flag doesn't add safety, it forces you to consciously opt in rather than pass a key around by accident.</li>
      <li><strong>Avoid</strong> setting <code>output_directory</code> to somewhere world-readable when encrypting — the whole point of <code>@DLM</code> encryption is that <code>.enc</code> is safe to commit/ship while the key isn't; putting both in the same exposed location defeats it.</li>
    </ul>
  </div>

  <h2>Constructors &amp; Fields</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Constructor / field</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { f: 'DixLoadOptions::new()',              d: 'Default options — no encryption, validate checksums, Strict compatibility.' },
          { f: 'DixLoadOptions::with_password(pw)',  d: 'Password-mode decryption.' },
          { f: 'DixLoadOptions::with_key_file(path)',d: 'Explicit key file path.' },
          { f: 'DixLoadOptions::with_key_content(content, ack)', d: 'Direct key file content from a trusted vault. Requires ack = true.' },
          { f: 'DixLoadOptions::with_key_url(url, ack)',         d: 'HTTPS-only URL for key file. Requires ack = true.' },
          { f: 'DixLoadOptions::with_key_search_paths(paths)',   d: 'Additional directories to search when auto-locating the key file.' },
          { f: '.validate_checksums',         d: 'bool — verify integrity hashes on load (default: true).' },
          { f: '.output_directory',           d: 'Option<String> — where to write .enc/.key/.au files (default: same directory as source).' },
          { f: '.throw_on_missing_sections',  d: 'bool — error if an expected section is absent (default: false).' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.f}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
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
