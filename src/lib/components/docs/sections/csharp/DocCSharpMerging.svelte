<!-- src/lib/components/docs/sections/csharp/DocCSharpMerging.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const mergeApi = `using MidManStudio.Mdix.Core;

// Two databases
MdixResult<MdixDatabase> merged = Dix.Merge(baseDb, overlayDb,
    MdixMergeStrategy.PrimaryWins);   // or SecondaryWins / etc.

// Any number, left to right
MdixResult<MdixDatabase> combined = Dix.MergeAll(
    new[] { baseDb, envDb, localOverridesDb },
    MdixMergeStrategy.PrimaryWins);

// Merge a raw JSON object into an existing database
MdixResult<MdixDatabase> withJson = Dix.MergeJson(baseDb, jsonOverlayString);

// Async variants exist for both
var mergedAsync = await Dix.MergeAsync(baseDb, overlayDb);
var combinedAsync = await Dix.MergeAllAsync(new[] { baseDb, envDb });

// Neither input is modified or disposed — Merge/MergeAll always
// return a new MdixDatabase.`;
</script>

<div class="doc-page">
  <h1>Merging Databases</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>.
  </p>
  <CodeBlock code={mergeApi} lang="csharp" />
</div>
