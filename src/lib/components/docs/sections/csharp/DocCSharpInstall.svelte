<!-- src/lib/components/docs/sections/csharp/DocCSharpInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const install = `<!-- .csproj -->
<PackageReference Include="MidManStudio.Mdix" Version="*" />

<!-- or: -->
dotnet add package MidManStudio.Mdix

<!-- Targets netstandard2.1, LangVersion 9.0. -->`;

  const unityInstall = `// Unity has its own first-class package — com.midmanstudio.mdix — not
// just the raw NuGet DLL. It bundles native mdix_ffi binaries for
// Windows/Linux/macOS/Android, plus Unity-specific extras (MdixAsset,
// editor asset creation, key storage helpers) beyond what the plain
// C# API gives you.

// Packages/manifest.json:
{
  "dependencies": {
    "com.midmanstudio.mdix": "https://github.com/Mid-D-Man/DixScript-Rust.git#upm"
  }
}

// WebGL specifically needs a second, separate package —
// com.midmanstudio.mdix.webgl — since the native mdix_ffi plugin
// approach above can't link into a WebGL build at all (Unity WebGL
// statically links everything into one Emscripten module, and there's
// no wasm32-unknown-emscripten build of mdix_ffi). It bridges to
// mdix-wasm's browser build instead, via a .jslib shim. As of this
// writing that package is an early, not-yet-build-tested slice —
// check its own README before relying on it.`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. Published on
    NuGet as <code>MidManStudio.Mdix</code> for plain .NET projects.
  </p>
  <CodeBlock code={install} lang="markup" />

  <h2>Unity</h2>
  <p>
    Unity gets a dedicated UPM package rather than the raw NuGet DLL —
    everything on the rest of this page and its sibling pages works the
    same way once installed, since it's the same
    <code>MidManStudio.Mdix.Core</code> underneath.
  </p>
  <CodeBlock code={unityInstall} lang="json" />

  <div class="tip-callout">
    <strong>Which package?</strong>
    <ul>
      <li><strong>Plain .NET / ASP.NET / console app</strong> — the NuGet package, <code>dotnet add package</code>.</li>
      <li><strong>Unity, any platform except WebGL</strong> — the <code>com.midmanstudio.mdix</code> UPM package. Native binaries for every desktop/mobile platform ship inside it, nothing extra to configure.</li>
      <li><strong>Unity WebGL</strong> — both <code>com.midmanstudio.mdix</code> <em>and</em> <code>com.midmanstudio.mdix.webgl</code>. Treat the WebGL bridge as early and unproven until its own README says otherwise — validate it in a real build before shipping anything on top of it.</li>
    </ul>
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
