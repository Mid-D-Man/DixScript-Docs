<!-- src/lib/components/docs/sections/java/DocJavaHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const hotReloadApi = `HotReload watcher = new HotReload("config.mdix");

// Poll on your own schedule — no background thread is started for you.
if (watcher.hasChanged()) {
    Optional<Database> reloaded = watcher.checkAndReload();
    reloaded.ifPresent(db -> System.out.println("config reloaded"));
}

// Or force a reload regardless of the mtime check:
Database db = watcher.forceReload();

watcher.hasLoaded();  // true once at least one successful load has happened
watcher.path();       // the source path being watched
watcher.close();      // implements Closeable — use try-with-resources`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#java-api">Java / Kotlin Runtime API</a>.
    <code>HotReload</code> is a manual, poll-based watcher — call
    <code>hasChanged()</code>/<code>checkAndReload()</code> on your own
    schedule (a game loop tick, a scheduled task); nothing runs on a
    background thread automatically.
  </p>
  <CodeBlock code={hotReloadApi} lang="java" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new HotReload(path)',   d: 'Create a watcher for a single plaintext .mdix file.' },
          { m: 'hasChanged()',           d: 'Check without reloading.' },
          { m: 'checkAndReload()',       d: 'Returns Optional<Database> — empty if unchanged (or on error).' },
          { m: 'forceReload()',          d: 'Reload unconditionally, regardless of whether the file changed.' },
          { m: 'hasLoaded()',            d: 'True once at least one reload has succeeded.' },
          { m: 'path()',                 d: 'The watched file\u2019s path.' },
          { m: 'close()',                d: 'Free the native handle — HotReload implements Closeable.' },
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
