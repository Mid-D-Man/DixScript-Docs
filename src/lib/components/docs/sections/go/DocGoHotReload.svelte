<!-- src/lib/components/docs/sections/go/DocGoHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const watchApi = `db, err := dixscript.Load("config.mdix")
defer db.Close()

db.OnReloaded(func(reloaded *dixscript.Database) {
    log.Println("config reloaded")
})
db.OnReloadFailed(func(err error) {
    log.Printf("reload failed: %v", err)
})

err = db.EnableHotReload(2 * time.Second) // poll interval
defer db.DisableHotReload()

db.IsHotReloadEnabled() // -> bool

// Note: EnableHotReload polls the source path Load() originally used —
// it has nothing to reload from for LoadStr()-created databases.`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={watchApi} lang="go" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'EnableHotReload(interval)',   d: 'Start polling the source file at the given interval. Requires a Load()-ed database.' },
          { m: 'DisableHotReload()',           d: 'Stop polling.' },
          { m: 'IsHotReloadEnabled()',         d: 'True if currently polling.' },
          { m: 'OnReloaded(func(*Database))',  d: 'Callback fired with the reloaded database on a successful reload.' },
          { m: 'OnReloadFailed(func(error))',  d: 'Callback fired with the error on a failed reload attempt.' },
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
