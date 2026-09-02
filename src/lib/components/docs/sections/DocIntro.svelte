<!-- src/lib/components/docs/sections/DocIntro.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  // Section cross-reference table
  const sectionAccess = [
    { section: '@CONFIG',     usedBy: ['Compiler'],                            canAccess: ['—'] },
    { section: '@IMPORTS',    usedBy: ['@QUICKFUNCS', '@DATA'],               canAccess: ['External .mdix files'] },
    { section: '@ENUMS',      usedBy: ['@QUICKFUNCS', '@DATA', '@SECURITY'],  canAccess: ['Defined in same file'] },
    { section: '@QUICKFUNCS', usedBy: ['@DATA', '@QUICKFUNCS'],               canAccess: ['@ENUMS', '@IMPORTS'] },
    { section: '@DATA',       usedBy: ['Runtime consumers'],                   canAccess: ['@ENUMS', '@QUICKFUNCS', '@IMPORTS'] },
    { section: '@SECURITY',   usedBy: ['@DLM → DEncryptor'],                  canAccess: ['@ENUMS'] },
    { section: '@DLM',        usedBy: ['Compiler pipeline'],                   canAccess: ['@SECURITY'] },
  ];

  const sections = [
    { name: '@CONFIG',     req: false, desc: 'Compiler settings and file metadata. All keys are optional.' },
    { name: '@IMPORTS',    req: false, desc: 'Import QuickFuncs and enums from other .mdix files — local or via URL.' },
    { name: '@ENUMS',      req: false, desc: 'Named constant sets enforced at compile time.' },
    { name: '@QUICKFUNCS', req: false, desc: 'Compile-time functions. Zero runtime overhead.' },
    { name: '@DATA',       req: false, desc: 'Your configuration data. A warning is issued if absent, but omission is valid.' },
    { name: '@SECURITY',   req: false, desc: 'Encryption mode and key configuration. Required when using DEncryptor — auto-filled by the compiler if omitted.' },
    { name: '@DLM',        req: false, desc: 'Data Lifecycle Modules: compression, encryption, auditing.' },
  ];

  const literalExample = `@data(          // valid — normalised to @DATA
  app = "x"
)

@Config(        // valid — normalised to @CONFIG
  version -> "1.0.0"
)`;
</script>

<div class="doc-page">
  <h1>Introduction</h1>

  <p class="page-lead">
    DixScript (<code>.mdix</code>) is a programmable configuration format where you define patterns
    once and reuse them everywhere. It combines configuration, compile-time functions, encryption,
    and compression in a single file — with zero external dependencies.
  </p>

  <h2>Everything Is Optional</h2>
  <p>
    Every section in a DixScript file is optional. A completely empty file is valid.
    If <code>@DATA</code> is absent the compiler issues a warning but continues normally.
    <code>@SECURITY</code> is auto-filled by the compiler when <code>DEncryptor</code> is present
    in <code>@DLM</code> and no <code>@SECURITY</code> block is provided.
    The minimal valid file is simply an empty file, or one that contains only a comment.
  </p>

  <h2>Section Keywords Are Case-Insensitive</h2>
  <p>
    Section opener keywords are matched case-insensitively by the compiler.
    <code>@data</code>, <code>@DATA</code>, and <code>@Data</code> are all equivalent.
    The conventional form uses all-caps, which is what formatters will normalise to.
  </p>

  <CodeBlock code={literalExample} lang="dixscript" />

  <h2>File Sections</h2>
  <div class="kv-table">
    {#each sections as row}
      <div class="kv-row">
        <code class="kv-key">{row.name}</code>
        <span class="kv-type">{row.req ? 'required' : 'optional'}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Section Order</h2>
  <p>
    Sections must appear in the order shown above when multiple are present.
    The compiler enforces ordering to enable single-pass resolution — for example,
    <code>@ENUMS</code> must precede <code>@QUICKFUNCS</code> so enum types are
    known when function signatures are parsed.
  </p>

  <h2>Which Section Can Access Which</h2>
  <p>
    Each section has a defined resolution scope. A section can only reference symbols
    from sections that precede it in the file.
  </p>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Section</th>
          <th>Used By</th>
          <th>Can Access</th>
        </tr>
      </thead>
      <tbody>
        {#each sectionAccess as row}
          <tr>
            <td><code>{row.section}</code></td>
            <td style="color:var(--muted-foreground)">{row.usedBy.join(', ')}</td>
            <td style="color:var(--muted-foreground)">{row.canAccess.join(', ')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Calling QuickFuncs and Using Enums</h2>
  <p>
    QuickFuncs and enum values may only be called or referenced from within
    <code>@QUICKFUNCS</code> and <code>@DATA</code>. They are compile-time constructs
    and have no representation at runtime — they are fully resolved before any output
    is produced.
  </p>
</div>
