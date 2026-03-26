<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

  const example = `@IMPORTS(
  // Local file
  Base    from "lib/base_types.mdix"

  // Cloud URL
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game_helpers.mdix"

  // With SHA-256 verification
  Secure  from "crypto/lib.mdix" verify "sha256:abc123..."
)

@DATA(
  item<object>  = Base.makeItem("W001", "Sword", Base.ItemType.WEAPON, 50)
  enemy<object> = Helpers.makeEnemy("E001", "Goblin", 100)
)`;
</script>

<section id="imports" class="doc-section">
  <h2>@IMPORTS</h2>
  <p>
    Import enums and functions from other .mdix files — local or via cloud URL.
    Access imported symbols through the alias namespace.
  </p>
  <pre><code>{example}</code></pre>

  <DocCallout type="info">
    Only functions declared <code>=&gt; global</code> are exported and importable.
    Circular imports are detected and rejected at compile time.
  </DocCallout>

  <h3>Path rules</h3>
  <ul>
    <li>Use forward slashes — no backslashes, even on Windows</li>
    <li>File extension <code>.mdix</code> is required</li>
    <li>No spaces in paths — use underscores or hyphens</li>
    <li>Paths are case-sensitive on Unix systems</li>
  </ul>
</section>
