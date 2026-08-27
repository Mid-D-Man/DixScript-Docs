<!-- src/lib/components/docs/sections/csharp/DocCSharpInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const install = `<!-- .csproj -->
<PackageReference Include="MidManStudio.Mdix" Version="*" />

<!-- or: -->
dotnet add package MidManStudio.Mdix`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. Published on
    NuGet as <code>MidManStudio.Mdix</code>.
  </p>
  <CodeBlock code={install} lang="markup" />
</div>
