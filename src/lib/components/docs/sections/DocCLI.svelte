<!-- src/lib/components/docs/sections/DocCLI.svelte -->
<script lang="ts">
  const commands = `mdix compile <file>              # Compile .mdix to binary
mdix compile <file> --password   # Compile with password encryption
mdix validate <file>             # Validate syntax and semantics
mdix inspect  <file>             # Print parsed data as JSON
mdix inspect  <file> --format json
mdix decrypt  <file.enc> --password <pw>
mdix convert  <file> --to json
mdix convert  <file> --to toml
mdix format   <file>
mdix minify   <file>`;
</script>

<div class="doc-page">
  <h1>CLI Reference</h1>
  <p class="page-lead">
    The <code>mdix</code> command-line tool. Currently partially implemented —
    the commands below reflect the intended API, not all are functional in the current Rust port.
  </p>
  <pre><code>{commands}</code></pre>

  <h2>Installation</h2>
  <pre><code># Via cargo (not yet published to crates.io)
cargo install mdix-cli</code></pre>

  <h2>Status</h2>
  <p>
    Track implementation progress on the <a href="/results">CI Results</a> page or in the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer">Rust repository</a>.
  </p>
</div>
