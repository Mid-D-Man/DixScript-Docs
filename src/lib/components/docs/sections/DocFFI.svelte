<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';

  const bindings = [
    { lang: 'C# / Unity',  pkg: 'MidManStudio.Mdix (NuGet)', cls: 'cs'     },
    { lang: 'Go',          pkg: 'mdix-go (cgo)',             cls: 'go'     },
    { lang: 'Java',        pkg: 'mdix-java (JNI)',           cls: 'java'   },
    { lang: 'Python',      pkg: 'midmanstudio-mdix (PyO3)',  cls: 'python' },
    { lang: 'PHP',         pkg: 'midmanstudio/mdix (FFI)',   cls: 'php'    },
    { lang: 'WebAssembly', pkg: 'mdix-wasm (npm)',           cls: 'wasm'   },
  ];
</script>

<section id="ffi" class="doc-section">
  <h2>Language Bindings</h2>
  <p>
    All wrappers bind to the Rust core via FFI. They compile but are not usable
    until the runtime reaches feature parity with the C# prototype.
  </p>

  <div class="bindings-grid">
    {#each bindings as b}
      <div class="binding-card">
        <div class="binding-lang binding-lang--{b.cls}">{b.lang}</div>
        <code class="binding-pkg">{b.pkg}</code>
        <span class="binding-status">⏳ Pending runtime</span>
      </div>
    {/each}
  </div>

  <DocCallout type="info">
    Track progress on the <a href="/results">CI Results</a> page or in the
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer">
      Rust repo ↗
    </a>.
  </DocCallout>
</section>

<style>
  .bindings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.875rem;
    margin: 1rem 0 1.5rem;
  }

  .binding-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.15s ease;
  }

  .binding-card:hover { border-color: var(--primary); }

  .binding-lang {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 0.1875rem 0.625rem;
    border-radius: 4px;
    width: fit-content;
  }

  .binding-lang--cs     { background: rgba(155,77,202,0.12); color: #9b4dca; border: 1px solid rgba(155,77,202,0.3); }
  .binding-lang--go     { background: rgba(0,172,215,0.12);  color: #00acd7; border: 1px solid rgba(0,172,215,0.3);  }
  .binding-lang--java   { background: rgba(248,152,32,0.12); color: #f89820; border: 1px solid rgba(248,152,32,0.3); }
  .binding-lang--python { background: rgba(46,168,160,0.12); color: #2ea8a0; border: 1px solid rgba(46,168,160,0.3); }
  .binding-lang--php    { background: rgba(136,146,191,0.12);color: #8892bf; border: 1px solid rgba(136,146,191,0.3);}
  .binding-lang--wasm   { background: rgba(125,214,125,0.12);color: #7dd67d; border: 1px solid rgba(125,214,125,0.3);}

  .binding-pkg    { font-size: 0.75rem; color: var(--foreground); word-break: break-all; }
  .binding-status { font-size: 0.75rem; color: var(--muted-foreground); }
</style>
