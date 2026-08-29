<!-- src/lib/components/docs/sections/python/DocPythonInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `pip install midmanstudio-mdix

# Pre-built wheels — no Rust toolchain required.
# Requires Python 3.8+

# Optional ML extras (numpy / pandas / torch / tensorflow) — see the
# "ML Extras" page. Install whichever of those you actually use;
# midmanstudio.mdix.ml imports them lazily.`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={install} lang="bash" />
</div>
