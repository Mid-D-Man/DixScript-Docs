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
</div>
