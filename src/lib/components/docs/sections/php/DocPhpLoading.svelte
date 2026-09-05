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

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'MdixDatabase::adopt(handle)',                d: 'Wrap an already-open native handle.' },
          { m: 'load(path) / loadStr(source)',                 d: 'Load from a file path or an in-memory source string.' },
          { m: 'fromJson(json) / fromToml(toml)',              d: 'Load from a foreign format string.' },
          { m: 'loadEncrypted(encPath, keyPath = null)',       d: 'Load an encrypted file, key from a file or auto-detected.' },
          { m: 'loadEncryptedPassword(encPath, password)',     d: 'Load an encrypted file, key derived from a password.' },
          { m: 'tryLoad / tryLoadStr / tryFromJson / tryFromToml', d: 'Railway twins — return MdixResult instead of throwing.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
