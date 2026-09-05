<!-- src/lib/components/docs/sections/go/DocGoBuilder.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const builderApi = `b := dixscript.NewBuilder()
defer b.Close()

b.SetString("profile.name", "player1")
b.SetInt("profile.level", 42)
b.SetFloat64("profile.score", 9876.5)
b.SetBool("profile.active", true)
b.SetDate("profile.joined", time.Now())

err := b.SaveToFile("profile.mdix")

// Or get it as a string
src, err := b.ToString()

// Or load it directly
db, err := b.ToDatabase()
defer db.Close()`;
</script>

<div class="doc-page">
  <h1>Builder API</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={builderApi} lang="go" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'NewBuilder() / NewBuilderFunc()',              d: 'Create a new, empty builder — both names construct the same type.' },
          { m: 'SetString/Int/Int32/Int64/Float32/Float64/Bool/Date/Timestamp(path, v)', d: 'Set a flat property value.' },
          { m: 'Remove(path)',                                  d: 'Remove a previously-set property.' },
          { m: 'HasKey(path)',                                  d: 'True if a property is set at path.' },
          { m: 'GetString/GetInt/GetInt64/GetFloat32/GetFloat64/GetBool(path)', d: 'Read back a value already set on the builder.' },
          { m: 'EntryCount() / Clear()',                        d: 'Number of set properties / reset the builder to empty.' },
          { m: 'SaveToFile(path)',                              d: 'Write the built source directly to a file.' },
          { m: 'ToString()',                                    d: 'Produce the raw .mdix source string.' },
          { m: 'ToDatabase()',                                  d: 'Parse the built source into a Database.' },
          { m: 'Close()',                                       d: 'Free the builder\u2019s native handle.' },
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
