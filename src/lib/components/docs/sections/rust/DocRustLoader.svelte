<!-- src/lib/components/docs/sections/rust/DocRustLoader.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@CONFIG(
  version -> "1.0.0"
  author  -> "MidManStudio"
)

@ENUMS(
  Rarity { COMMON, UNCOMMON, RARE, LEGENDARY }
)

@DATA(
  app_name = "MyGame"
  debug    = false

  server:
    host = "0.0.0.0"
    port<int> = 8080
    ssl  = true

  enemies::
    { name = "Goblin", hp<int> = 50,  rarity = Rarity.COMMON },
    { name = "Orc",    hp<int> = 100, rarity = Rarity.UNCOMMON },
    { name = "Dragon", hp<int> = 500, rarity = Rarity.LEGENDARY }
)`;

  const loaderBasic = `// Add to Cargo.toml:
// dixscript = { path = "../dixscript" }
// (or version once published to crates.io)

use dixscript::Runtime::{DixLoader, DixLoadOptions, DixData};

fn main() -> Result<(), String> {
    let loader = DixLoader::new();
    let opts   = DixLoadOptions::new();

    // config.mdix is the file shown above
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
    // Same shape as config.mdix above, trimmed for a unit test —
    // this is the pattern to reach for when you don't want a fixture
    // file on disk just to exercise a config shape.
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
    string, or from an encrypted payload. It doesn't hold any state about
    <em>which</em> file you last loaded — every call is independent, so one
    <code>DixLoader</code> is safe to reuse across many unrelated loads.
  </p>

  <h2>Example .mdix file</h2>
  <p>
    This is <code>config.mdix</code> — the file every snippet on this page
    loads. A flat property, a table (<code>server:</code>), and a group
    array of objects (<code>enemies::</code>) covers the shapes you'll hit
    in practice; see <a href="#data">@DATA</a> for the full syntax
    reference.
  </p>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <h3>Load a plain .mdix file</h3>
  <CodeBlock code={loaderBasic} lang="rust" />

  <h3>Load from a string</h3>
  <CodeBlock code={loaderFromStr} lang="rust" />

  <h3>Load encrypted files</h3>
  <CodeBlock code={loaderEncrypted} lang="rust" />

  <div class="tip-callout">
    <strong>Which load method?</strong>
    <ul>
      <li><strong>Use <code>load_text</code></strong> for real config files that live on disk and might use <code>@DLM</code> directives (encryption, compression, audit output) — it's the only one that runs the full file-output pipeline.</li>
      <li><strong>Use <code>load_from_str</code></strong> for unit tests, embedded default configs compiled into your binary, or anything generated at runtime — it's faster to set up but silently skips any <code>@DLM</code> file-output step, since there's no source file path to write relative to.</li>
      <li><strong>Avoid</strong> calling <code>load_text</code> in a hot loop — each call re-runs the full tokenize → parse → semantic-analysis pipeline from scratch. Load once and keep the <code>DixData</code>; if the source can change underneath you, use <a href="#rust-api--hot-reload"><code>HotReloadWatcher</code></a> instead of re-loading unconditionally — it only re-parses when the file's mtime actually moves.</li>
    </ul>
  </div>

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
