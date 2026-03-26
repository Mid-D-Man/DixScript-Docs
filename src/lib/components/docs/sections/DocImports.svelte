<!-- src/lib/components/docs/sections/DocImports.svelte -->
<script lang="ts">
  const example = `@IMPORTS(
  // Local file
  Base    from "lib/base_types.mdix"

  // Cloud URL
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game_helpers.mdix"

  // With SHA-256 verification
  Secure  from "crypto/lib.mdix" verify "sha256:abc123..."
)

@DATA(
  item  = Base.makeItem("W001", "Sword", 50)
  enemy = Helpers.makeEnemy("E001", "Goblin", 100)
)`;
</script>

<div class="doc-page">
  <h1>@IMPORTS</h1>
  <p class="page-lead">
    Import enums and functions from other <code>.mdix</code> files — local or via cloud URL.
    Access imported symbols through the alias namespace. Requires <code>features -> "advanced"</code>.
  </p>
  <pre><code>{example}</code></pre>

  <h2>Path Rules</h2>
  <ul>
    <li>Only functions declared <code>=> global</code> are exported and importable</li>
    <li>Circular imports are detected and rejected at compile time</li>
    <li>Use forward slashes — no backslashes, even on Windows</li>
    <li>File extension <code>.mdix</code> is required</li>
    <li>Paths are case-sensitive on Unix systems</li>
  </ul>
</div>
