<!-- src/lib/components/docs/sections/rust/DocRustLoader.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const loaderBasic = `// Add to Cargo.toml:
// dixscript = { path = "../dixscript" }
// (or version once published to crates.io)

use dixscript::Runtime::{DixLoader, DixLoadOptions, DixData};

fn main() -> Result<(), String> {
    let loader = DixLoader::new();
    let opts   = DixLoadOptions::new();

    // Load a plain .mdix file — runs the full compilation pipeline
    let data: DixData = loader.load_text("config.mdix", &opts)?;

    // Read a typed value by dotted path
    let port: i32    = data.get("server.port")?;
    let host: String = data.get("server.host")?;
    let debug: bool  = data.get("debug")?;

    println!("{}:{} debug={}", host, port, debug);
    Ok(())
}`;

  const loaderFromStr = `use dixscript::Runtime::{DixLoader, DixLoadOptions};

fn load_inline() -> Result<(), String> {
    let source = r#"
        @DATA(
          app_name = "MyApp"
          port     = 8080
        )
    "#;

    let loader = DixLoader::new();
    let data   = loader.load_from_str(source, &DixLoadOptions::new())?;

    let name: String = data.get("app_name")?;
    let port: i32    = data.get("port")?;
    println!("{} on port {}", name, port);
    Ok(())
}`;

  const loaderEncrypted = `use dixscript::Runtime::{DixLoader, DixLoadOptions};

fn load_encrypted_keyfile() -> Result<(), String> {
    let loader = DixLoader::new();

    // Keyfile mode — key file must be alongside the .enc file,
    // or supply the path explicitly:
    let opts = DixLoadOptions::with_key_file("/vault/secrets.mdix.key");
    let data = loader.load_encrypted("secrets.mdix.enc", &opts)?;

    let api_key: String = data.get("api.key")?;
    Ok(())
}

fn load_encrypted_password() -> Result<(), String> {
    let loader = DixLoader::new();
    let opts   = DixLoadOptions::with_password("my-strong-password");
    let data   = loader.load_encrypted("secrets.mdix.enc", &opts)?;
    Ok(())
}

fn load_encrypted_bytes() -> Result<(), String> {
    // Both payload and key arrive from a network response — no disk access needed
    let encrypted_bytes: Vec<u8>  = fetch_from_vault_bytes();
    let key_file_content: String  = fetch_from_vault_key();

    let loader = DixLoader::new();
    let opts   = DixLoadOptions::new();
    let data   = loader.load_from_encrypted_bytes(
        &encrypted_bytes,
        &key_file_content,
        &opts,
    )?;
    Ok(())
}

fn fetch_from_vault_bytes() -> Vec<u8> { vec![] }  // placeholder
fn fetch_from_vault_key()   -> String  { String::new() }`;
</script>

<div class="doc-page">
  <h1>DixLoader — Loading Files</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. <code>DixLoader</code> is
    the entry point for reading <code>.mdix</code> files from disk, from an inline
    string, or from an encrypted payload.
  </p>

  <h3>Load a plain .mdix file</h3>
  <CodeBlock code={loaderBasic} lang="rust" />

  <h3>Load from a string</h3>
  <CodeBlock code={loaderFromStr} lang="rust" />

  <h3>Load encrypted files</h3>
  <CodeBlock code={loaderEncrypted} lang="rust" />

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'DixLoader::new()',                          d: 'Create a loader with an isolated error manager. Each instance owns its own error state — parallel loads never mix.' },
          { m: 'loader.load_text(path, &opts)',             d: 'Load and compile a plain .mdix file from disk. Runs the full pipeline: tokenize → parse → semantic analysis → AST enhancement → value resolution.' },
          { m: 'loader.load_from_str(source, &opts)',       d: 'Compile DixScript source from a string. No disk access. DLM file-output steps are skipped.' },
          { m: 'loader.load_encrypted(path, &opts)',        d: 'Load an encrypted .mdix.enc file. Locates the key file automatically or uses the path/password from DixLoadOptions.' },
          { m: 'loader.load_from_encrypted_bytes(&bytes, key_content, &opts)', d: 'Decrypt and load from raw bytes and key file content. No files written except temporary ones that are immediately cleaned up.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
