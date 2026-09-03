<!-- src/lib/components/docs/sections/c/DocCBuildLink.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const layout = `mdix-c/
  include/
    mdix.h
    mdix.hpp
  lib/
    linux-x64/   libmdix_ffi.so
    windows-x64/ mdix_ffi.dll  mdix_ffi.lib
    macos/       libmdix_ffi.dylib
  CMakeLists.txt`;

  const cmake = `add_subdirectory(mdix-c)        # or wherever you placed the package

target_link_libraries(my_app PRIVATE mdix::mdix)`;
</script>

<div class="doc-page">
  <h1>Build &amp; Link</h1>
  <p class="page-lead">
    Part of the <a href="#c-api">C / C++ Runtime API</a>. No package
    manager — download the prebuilt package and point CMake at it.
  </p>

  <h2>Download</h2>
  <p>
    Download <code>mdix-c-package-build-N.zip</code> from the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust/actions" target="_blank" rel="noopener noreferrer">Actions artifacts</a>
    or the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust/releases" target="_blank" rel="noopener noreferrer">Releases page</a>.
    Unzip next to your project — <code>CMakeLists.txt</code> expects this layout:
  </p>
  <CodeBlock code={layout} lang="bash" />

  <h2>CMake integration</h2>
  <CodeBlock code={cmake} lang="bash" />

  <h2>Compiler requirements</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Language</th><th>Minimum standard</th></tr></thead>
      <tbody>
        <tr><td>C</td><td><code>C99</code></td></tr>
        <tr><td>C++</td><td><code>C++17</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2>Platform notes</h2>
  <div class="tip-callout">
    <strong>Linking per platform</strong>
    <ul>
      <li><strong>Windows (MSVC):</strong> link against <code>mdix_ffi.lib</code> (the import library); <code>mdix_ffi.dll</code> must be on <code>PATH</code> or next to the executable at runtime.</li>
      <li><strong>Linux:</strong> set <code>LD_LIBRARY_PATH</code>, install <code>libmdix_ffi.so</code> to a system lib path, or pass <code>-Wl,-rpath,'$ORIGIN'</code> to embed the search path in the binary.</li>
      <li><strong>macOS:</strong> <code>@rpath</code> is already set in the dylib. Pass <code>-Wl,-rpath,@loader_path</code> or install to <code>/usr/local/lib</code>.</li>
    </ul>
  </div>

  <h2>Tests (from source)</h2>
  <p>
    Building the package from the <code>DixScript-Rust</code> monorepo directly:
  </p>
  <CodeBlock code={`cmake -B build -DMDIX_BUILD_TESTS=ON\ncmake --build build\nctest --test-dir build --output-on-failure`} lang="bash" />
  <p>
    Two self-contained binaries, no GoogleTest/Catch2 dependency (matching the
    package's own header-only, dependency-minimal design):
    <code>test_mdix_c</code> exercises the plain C API directly,
    <code>test_mdix_cpp</code> exercises the <code>mdix.hpp</code> RAII wrapper —
    a bug in the header-only layer itself (RAII lifetime, <code>Result&lt;T&gt;</code>
    plumbing, the conflict-JSON scanner behind <code>merge_sources()</code>)
    wouldn't show up testing the C API alone.
  </p>
</div>

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>
