<!-- src/lib/components/docs/sections/go/DocGoVsCSharp.svelte -->
<script lang="ts">
</script>

<div class="doc-page">
  <h1>vs C#</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Concept</th><th>C#</th><th>Go</th></tr></thead>
      <tbody>
        {#each [
          { c: 'Load',    cs: 'Dix.Load(path)',                  go: 'dixscript.Load(path)' },
          { c: 'Read',    cs: 'db.GetInt("path").OrThrow()',     go: 'db.GetInt("path") -> (int, error)' },
          { c: 'Build',   cs: 'MdixBuilder.Create()',            go: 'dixscript.NewBuilder()' },
          { c: 'Close',   cs: 'using var db = ... (IDisposable)', go: 'defer db.Close() (io.Closer)' },
          { c: 'Errors',  cs: 'MdixResult<T> with .IsSuccess',   go: '(T, error) idiomatic Go' },
          { c: 'FFI glue',cs: 'csbindgen auto-generates MdixNative.cs', go: 'cgo, hand-written internal/ffi.go' },
          { c: 'Header',  cs: 'not needed',                       go: 'mdix_ffi.h (cbindgen generated)' },
        ] as row}
          <tr>
            <td style="font-weight:500">{row.c}</td>
            <td><code style="font-size:0.75rem">{row.cs}</code></td>
            <td><code style="font-size:0.75rem">{row.go}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
