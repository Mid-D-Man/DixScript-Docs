<script lang="ts">
  import DocCallout from '$lib/components/docs/DocCallout.svelte';
</script>

<section id="intro" class="doc-section">
  <h1>DixScript Documentation</h1>

  <DocCallout type="warn">
    ⚠️ DixScript is under active development and not production-ready.
    The <a href="https://github.com/Mid-D-Man/DixScript" target="_blank" rel="noopener noreferrer">C# prototype</a>
    is the current reference implementation. The Rust port is in progress.
  </DocCallout>

  <p>
    DixScript (<code>.mdix</code>) is a programmable configuration format where you define patterns
    once and reuse them everywhere. It combines configuration, compile-time functions, encryption,
    and compression in a single file — with zero external dependencies.
  </p>

  <p>
    A minimal DixScript file requires only a <code>@DATA</code> section.
    Everything else is optional and additive — adopt features as you need them.
  </p>

  <h2>File sections</h2>
  <div class="kv-table">
    {#each [
      { name: '@CONFIG',      req: false, desc: 'Compiler settings and file metadata'                       },
      { name: '@IMPORTS',     req: false, desc: 'Import functions and enums from other .mdix files'          },
      { name: '@ENUMS',       req: false, desc: 'Named constant sets — enforced at compile time'             },
      { name: '@QUICKFUNCS',  req: false, desc: 'Compile-time functions — zero runtime overhead'             },
      { name: '@DATA',        req: true,  desc: 'Your configuration data — the only required section'        },
      { name: '@SECURITY',    req: false, desc: 'Encryption mode and key configuration'                      },
      { name: '@DLM',         req: false, desc: 'Data Lifecycle Modules: compression, encryption, auditing'  },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.name}</code>
        <span class="kv-type">{row.req ? 'required' : 'optional'}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>
</section>
