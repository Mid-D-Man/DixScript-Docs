<!-- src/lib/components/docs/sections/java/DocJavaFacade.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const facadeApi = `import com.midmanstudio.dixscript.DixScript;

DixScript.version();                              // -> String
DixScript.load(String path);                       // -> Database, throws MdixException
DixScript.loadStr(String source);                   // -> Database
DixScript.loadEncrypted(String encPath, String keyPath);         // -> Database
DixScript.loadEncryptedPassword(String encPath, String password); // -> Database
DixScript.loadJson(String json);                    // -> Database
DixScript.loadToml(String toml);                    // -> Database
DixScript.newBuilder();                             // -> Builder
DixScript.convert();                                // -> Converter`;
</script>

<div class="doc-page">
  <h1>DixScript Facade</h1>
  <p class="page-lead">Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.</p>
  <CodeBlock code={facadeApi} lang="java" />
</div>
