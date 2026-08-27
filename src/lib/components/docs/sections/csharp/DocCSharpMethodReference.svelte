<!-- src/lib/components/docs/sections/csharp/DocCSharpMethodReference.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>Dix Facade — Full Method Reference</h1>
  <p class="page-lead">
    Part of the <a href="#csharp-api">C# / Unity Runtime API</a>. Every
    static method on <code>Dix</code>, grouped by category.
  </p>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Category</th><th>Methods</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',        d: 'Load, LoadStr, LoadEncrypted, LoadEncryptedPassword, LoadEncryptedBytes, LoadEncryptedWith — each with an *Async twin' },
          { c: 'Foreign in',  d: 'LoadJson, LoadToml' },
          { c: 'Merge',       d: 'Merge, MergeAll, MergeJson — each with an *Async twin' },
          { c: 'Deserialize', d: 'Deserialize<T>(path, prefix), DeserializeFrom<T>(db, prefix)' },
          { c: 'Build',       d: 'Builder(), BuilderFrom(db)' },
          { c: 'Convert',     d: 'ToMdix, ToJson, ToToml, Format, Minify' },
          { c: 'Cache',       d: 'ClearSerializerCache()' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.c}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
