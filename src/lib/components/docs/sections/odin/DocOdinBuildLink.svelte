<!-- src/lib/components/docs/sections/odin/DocOdinBuildLink.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `# 1. Build the native library from DixScript-Rust:
cargo build --release -p mdix-ffi
# Linux:   target/release/libmdix_ffi.so
# macOS:   target/release/libmdix_ffi.dylib
# Windows: target/release/mdix_ffi.dll + mdix_ffi.lib

# 2. Link from Odin — mdix_ffi/mdix_ffi.odin uses:
#      foreign import "system:mdix_ffi"          (system:mdix_ffi.lib on Windows)
odin build . -extra-linker-flags:"-L/path/to/lib -Wl,-rpath,/path/to/lib"
# Windows/MSVC: -extra-linker-flags:"/LIBPATH:C:\\path\\to\\lib"

# Or drop the library next to your executable, or install to a standard
# system path — same rules as mdix-c.`;
</script>

<div class="doc-page">
  <h1>Build &amp; Link</h1>
  <p class="page-lead">Part of the <a href="#odin-api">Odin Runtime API</a>.</p>
  <CodeBlock code={install} lang="bash" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Platform</th><th>Linking notes</th></tr></thead>
      <tbody>
        {#each [
          { m: 'Linux',   d: 'Link against libmdix_ffi.so; set LD_LIBRARY_PATH or pass -Wl,-rpath to embed the search path.' },
          { m: 'macOS',    d: 'Link against libmdix_ffi.dylib; @rpath is already set, pass -Wl,-rpath,@loader_path or install to /usr/local/lib.' },
          { m: 'Windows (MSVC)', d: 'Link against mdix_ffi.lib (import library); mdix_ffi.dll must be on PATH or next to the executable at runtime.' },
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
