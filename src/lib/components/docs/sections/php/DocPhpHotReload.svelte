<!-- src/lib/components/docs/sections/php/DocPhpHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const watchPhp = `use MidManStudio\\Mdix\\MdixHotReload;

$watcher = new MdixHotReload('config.mdix');

while ($running) {
    $fresh = $watcher->checkAndReload();   // ?MdixDatabase — null if unchanged (or on error)
    if ($fresh !== null) {
        applyNewConfig($fresh);
    }
    tick();
}

$watcher->close();`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. Watches a single
    plaintext <code>.mdix</code> path via a poll-based check — a cheap
    <code>stat()</code>, not an OS filesystem-event subscription — so it's
    identical behavior everywhere PHP runs, including hosts without
    <code>inotify</code>.
  </p>

  <CodeBlock code={watchPhp} lang="php" />

  <p>
    <code>checkAndReload()</code> returns <code>null</code> for two different
    reasons — nothing changed, <em>or</em> the reload attempt failed — and
    doesn't distinguish between them in its return value alone.
    <code>forceReload()</code> reloads unconditionally and throws on
    failure instead, which is the one to reach for when you need to tell
    "unchanged" apart from "broke." Encrypted <code>.mdix</code> files are
    not supported — a core Runtime limitation, not something this binding
    could opt out of.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixHotReload(path)',   d: 'Create a watcher for a single plaintext .mdix file.' },
          { m: 'checkAndReload()',           d: 'Returns ?MdixDatabase — null if unchanged (or on error).' },
          { m: 'forceReload()',              d: 'Reload unconditionally, throws on failure.' },
          { m: 'hasChanged()',               d: 'Check without reloading.' },
          { m: 'hasLoaded()',                d: 'True once at least one reload has succeeded.' },
          { m: 'close()',                    d: 'Release the native handle.' },
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
