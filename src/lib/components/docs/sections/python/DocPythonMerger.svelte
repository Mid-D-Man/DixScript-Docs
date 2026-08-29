<!-- src/lib/components/docs/sections/python/DocPythonMerger.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const mergerApi = `from midmanstudio.mdix import MdixMerger

# Merge multiple .mdix sources with weighted or strict conflict resolution
db = (MdixMerger()
      .with_strategy("primary_wins")        # or "secondary_wins", etc.
      .with_array_strategy("concat")        # array-specific merge strategy
      .merge_strings([
          ("base",    '@DATA( name = "App", port = 8080 )', 1.0),
          ("overlay", '@DATA( name = "Override", debug = true )', 0.5),
      ]))

# From files instead of strings
db2 = MdixMerger().merge_files(["base.mdix", "overrides.mdix"])
db3 = MdixMerger().merge_files_weighted([("base.mdix", 1.0), ("local.mdix", 0.8)])

# Railway variants
result  = MdixMerger().try_merge_files(["base.mdix", "overrides.mdix"])
result2 = MdixMerger().try_merge_files_weighted([("base.mdix", 1.0)])`;
</script>

<div class="doc-page">
  <h1>MdixMerger — Combining Sources</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={mergerApi} lang="python" />
</div>
