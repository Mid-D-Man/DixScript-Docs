<!-- src/lib/components/docs/sections/php/DocPhpLoading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const loadApi = `use MidManStudio\\Mdix\\MdixDatabase;

// Direct — throws MdixException on failure
MdixDatabase::load(string $path);
MdixDatabase::loadStr(string $source);
MdixDatabase::fromJson(string $json);
MdixDatabase::fromToml(string $toml);
MdixDatabase::loadEncrypted(string $encPath, ?string $keyPath = null);
MdixDatabase::loadEncryptedPassword(string $encPath, string $password);

// Railway — return MdixResult instead of throwing
MdixDatabase::tryLoad(string $path): MdixResult;
MdixDatabase::tryLoadStr(string $source): MdixResult;
MdixDatabase::tryFromJson(string $json): MdixResult;
MdixDatabase::tryFromToml(string $toml): MdixResult;`;
</script>

<div class="doc-page">
  <h1>Loading</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={loadApi} lang="php" />
</div>
