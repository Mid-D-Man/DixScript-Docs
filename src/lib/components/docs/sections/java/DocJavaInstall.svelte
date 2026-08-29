<!-- src/lib/components/docs/sections/java/DocJavaInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `<!-- Maven -->
<dependency>
    <groupId>com.midmanstudio</groupId>
    <artifactId>dixscript</artifactId>
    <version>LATEST</version>
</dependency>

// Gradle
implementation("com.midmanstudio:dixscript:LATEST")

// Java 11+`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={install} lang="text" />
</div>
