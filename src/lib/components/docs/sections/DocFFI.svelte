<!-- src/lib/components/docs/sections/DocFFI.svelte -->
<script lang="ts">
  const bindings = [
    { lang: 'C# / Unity', pkg: 'MidManStudio.Mdix (NuGet)', cls: 'cs'     },
    { lang: 'Go',         pkg: 'mdix-go (cgo)',             cls: 'go'     },
    { lang: 'Java',       pkg: 'mdix-java (JNI)',           cls: 'java'   },
    { lang: 'Python',     pkg: 'midmanstudio-mdix (PyO3)',  cls: 'python' },
    { lang: 'PHP',        pkg: 'midmanstudio/mdix (FFI)',   cls: 'php'    },
    { lang: 'WebAssembly',pkg: 'mdix-wasm (npm)',           cls: 'wasm'   },
  ];
</script>

<div class="doc-page">
  <h1>Language Bindings</h1>
  <p class="page-lead">
    All wrappers bind to the Rust core via FFI. They compile but are not usable
    until the runtime reaches feature parity with the C# prototype.
  </p>

  <div class="bindings-grid">
    {#each bindings as b}
      <div class="binding-card">
        <div class="binding-lang binding-lang--{b.cls}">{b.lang}</div>
        <code class="binding-pkg">{b.pkg}</code>
        <span class="binding-status">Pending runtime</span>
      </div>
    {/each}
  </div>

  <p>
    Track progress on the <a href="/results">CI Results</a> page or in the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer">Rust repo</a>.
  </p>
</div>

<style>
  .binding-lang--cs     { background: rgba(155,77,202,.12);  color: #9b4dca; border: 1px solid rgba(155,77,202,.3);  }
  .binding-lang--go     { background: rgba(0,172,215,.12);   color: #00acd7; border: 1px solid rgba(0,172,215,.3);   }
  .binding-lang--java   { background: rgba(248,152,32,.12);  color: #f89820; border: 1px solid rgba(248,152,32,.3);  }
  .binding-lang--python { background: rgba(46,168,160,.12);  color: #2ea8a0; border: 1px solid rgba(46,168,160,.3);  }
  .binding-lang--php    { background: rgba(136,146,191,.12); color: #8892bf; border: 1px solid rgba(136,146,191,.3); }
  .binding-lang--wasm   { background: rgba(125,214,125,.12); color: #5aab5a; border: 1px solid rgba(125,214,125,.3); }
</style>
