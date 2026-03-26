<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

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

<section id="cli" class="doc-section">
  <h2>CLI Reference</h2>

  <DocCallout type="warn">
    CLI is partially implemented. Commands below reflect the intended API —
    not all are functional in the current Rust port.
  </DocCallout>

  <pre><code>{commands}</code></pre>
</section>
