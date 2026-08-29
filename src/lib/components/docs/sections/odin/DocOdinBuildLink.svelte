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
</div>
