<!-- src/lib/components/docs/sections/DocImports.svelte -->
<script lang="ts">
  const syntaxExample = `@IMPORTS(
  // Local file — path relative to the current file
  Base    from "lib/base_types.mdix"

  // Cloud URL — fetched at compile time
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game/game_helpers.mdix"

  // With SHA-256 integrity verification
  Secure  from "crypto/verified_lib.mdix" verify "sha256:abc123def456..."
)`;

  const usingImportedEnums = `@IMPORTS(
  Base from "lib/base_types.mdix"
)

// Using an imported enum as a type and a value:
@DATA(
  rarity<enum> = Base.Rarity.LEGENDARY

  // You must prefix with the import alias:
  item_type<enum> = Base.ItemType.WEAPON
)`;

  const usingImportedFuncs = `@IMPORTS(
  Base    from "lib/base_types.mdix"
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game/game_helpers.mdix"
)

@QUICKFUNCS(
  // Calling an imported function from within a local QuickFunc:
  ~buildEnemy<object>(id<string>, name<string>, health<int>) {
    // Helpers.makeEnemy is defined in game_helpers.mdix
    let base = Helpers.makeEnemy(id, name, health, Difficulty.NORMAL)
    return base
  }
)

@DATA(
  // Using imported functions directly in @DATA:
  sword = Base.makeItem("W001", "Iron Sword", Base.ItemType.WEAPON, Base.Rarity.COMMON, 25)

  enemies::
    Helpers.makeEnemy("E001", "Goblin", 50,  Difficulty.EASY),
    Helpers.makeEnemy("E002", "Troll",  200, Difficulty.HARD)

  // Mixing local and imported functions:
  hero_weapon = buildEnemy("W999", "Hero Blade", 999)
)`;

  const exportingFuncs = `// In base_types.mdix — no scope declaration = global (exportable by default)
@QUICKFUNCS(
  ~makeItem<object>(id<string>, name<string>, type<enum>, rarity<enum>, value<int>) {
    return {
      id     = id
      name   = name
      type   = type
      rarity = rarity
      value  = value
      sell   = value / 2
    }
  }

  // Scoped — NOT exportable, only usable within this file:
  ~internalHelper<int>(x<int>) => items {
    return x * 3
  }
)`;

  const circularNote = `// INVALID — circular imports are detected and rejected at compile time:
// a.mdix imports b.mdix
// b.mdix imports a.mdix  ← compiler error: circular import`;

  const pathRules = `// Path rules for "from" imports:
//   - Forward slashes only, even on Windows
//   - .mdix extension required
//   - Relative to the file containing @IMPORTS
//   - No backslashes, no .. traversal outside the project root
//   - Case-sensitive on Unix systems

// Valid:
Base from "lib/base_types.mdix"
Util from "../../shared/utils.mdix"

// Invalid:
Bad  from "lib\\base_types.mdix"  // backslash
Bad2 from "lib/base_types"         // missing extension`;
</script>

<div class="doc-page">
  <h1>@IMPORTS</h1>
  <p class="page-lead">
    Import QuickFuncs and enums from other <code>.mdix</code> files — local paths or
    cloud URLs. Imported symbols are accessed through their alias prefix.
    Requires <code>features -> "advanced"</code> (the default).
  </p>
  <pre><code>{syntaxExample}</code></pre>

  <h2>Using Imported Enums</h2>
  <p>
    Imported enum types and values are accessed via the import alias.
    Both type annotations and value references must be prefixed.
  </p>
  <pre><code>{usingImportedEnums}</code></pre>

  <h2>Using Imported QuickFuncs</h2>
  <p>
    Imported functions may be called directly in <code>@DATA</code> or inside other
    <code>@QUICKFUNCS</code> bodies. Always prefix with the import alias.
  </p>
  <pre><code>{usingImportedFuncs}</code></pre>

  <h2>Exporting Functions From Your File</h2>
  <p>
    All QuickFuncs with no scope declaration are global by default — they are
    automatically exportable and importable by other files. To prevent a function
    from being imported, restrict it to a specific data path with a scope declaration.
  </p>
  <pre><code>{exportingFuncs}</code></pre>

  <h2>Path Rules</h2>
  <pre><code>{pathRules}</code></pre>

  <h2>Circular Imports</h2>
  <p>The compiler detects and rejects circular import chains at compile time.</p>
  <pre><code>{circularNote}</code></pre>

  <h2>Integrity Verification</h2>
  <p>
    Adding <code>verify "sha256:…"</code> to an import declaration causes the compiler
    to compute a SHA-256 hash of the fetched file and compare it to the provided value.
    Compilation fails if the hashes do not match. This is especially useful for
    cloud imports to guard against supply-chain tampering.
  </p>

  <div class="kv-table">
    {#each [
      { key: 'from "path"',               type: 'local',   desc: 'Load from a local file path relative to the current file.' },
      { key: 'from_cloud "https://…"',    type: 'remote',  desc: 'Fetch from a URL at compile time. Requires internet access during compilation.' },
      { key: 'verify "sha256:…"',         type: 'optional',desc: 'SHA-256 hash of the imported file. Compilation fails on mismatch.' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</div>
