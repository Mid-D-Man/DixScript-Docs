<!-- src/lib/components/docs/sections/odin/DocOdinHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const watchApi = `import "mdix"

// Deliberately NOT a background thread — Odin's usual consumer already
// has its own per-frame loop (a game, an editor), so this is a one-line
// call inside it rather than a second thread + mutex around db.handle.
hr: mdix.Hot_Reload
mdix.hot_reload_init(&hr, "config.mdix")
defer mdix.hot_reload_destroy(&hr)

for /* your main loop */ {
    if mdix.hot_reload_check(&hr, &db) {
        fmt.println("config reloaded")
    }
    // ...rest of frame
}

// hot_reload_check re-stats the file every call (a stat(), not a
// reparse, unless it actually changed) — call it as often as you'd
// poll anything else in the loop.`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={watchApi} lang="odin" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Procedure</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'hot_reload_init(&hr, path)', d: 'Initialize a watcher for a single plaintext .mdix file.' },
          { m: 'hot_reload_destroy(&hr)',     d: 'Free the watcher.' },
          { m: 'hot_reload_check(&hr, &db)',  d: 'Re-stat the file; reloads db in place and returns true only if it changed.' },
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
