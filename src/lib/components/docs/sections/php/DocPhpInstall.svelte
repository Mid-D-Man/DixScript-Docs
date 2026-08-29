<!-- src/lib/components/docs/sections/php/DocPhpInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `composer require midmanstudio/mdix

# Requires the PHP FFI extension enabled (ffi.enable=true in php.ini —
# or ffi.enable=preload if you're preloading). PHP 8.1+.`;

  const nativeLib = `# Composer installs the PHP wrapper — it does NOT ship a compiled binary.
# FFI needs the actual native shared library, resolved in this order:
#
#   1. MDIX_LIB_PATH env var — absolute path to the .so/.dylib/.dll
#   2. vendor/midmanstudio/mdix/lib/<platform file>  (or mdix-php/lib/ in
#      a source checkout) — this is what CI populates
#   3. The OS library loader (LD_LIBRARY_PATH, PATH, etc.) as a last resort

# Build it yourself from a DixScript-Rust checkout:
cargo build -p mdix-ffi --release

# Then copy the platform output into lib/:
#   Linux:   target/release/libmdix_ffi.so   -> lib/libmdix_ffi.so
#   macOS:   target/release/libmdix_ffi.dylib -> lib/libmdix_ffi.dylib
#   Windows: target/release/mdix_ffi.dll      -> lib/mdix_ffi.dll

# Or point at a prebuilt copy without moving it:
export MDIX_LIB_PATH=/path/to/libmdix_ffi.so`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={install} lang="bash" />

  <h3>Native library setup</h3>
  <p>
    Composer installs the PHP wrapper class only — FFI still needs the
    compiled Rust shared library, which isn't published to Packagist. Build
    it once and point the loader at it.
  </p>
  <CodeBlock code={nativeLib} lang="bash" />
</div>
