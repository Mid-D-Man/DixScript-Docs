<!-- src/lib/components/docs/sections/wasm/DocWasmDlm.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DLM(
  DCompressor.xz
  DEncryptor.aes256
)

@DATA(
  api_key = "sk_live_51H8x..."
  secret  = "whsec_9f3e2a..."
)`;

  const dlmApi = `import { compileWithDlm, decompileWithDlm } from "@midmanstudio/mdix";

const source = \`
  @DLM(DCompressor.xz, DEncryptor.aes256)
  @DATA(secret = "shh")
\`;

// Compiles, then runs whatever @DLM modules the source declares — all
// in memory. Nothing touches disk; wasm32 has no real filesystem to
// touch in the first place.
const outcome = compileWithDlm(source, "my-config");
if (!outcome.isSuccess()) throw new Error(outcome.errors().join("; "));

const encryptedBytes = outcome.processedData();   // Uint8Array
const keyFileContent = outcome.keyFileContent();   // string | undefined
const modulesRun      = outcome.executedModules(); // e.g. ["DCompressor.xz", "DEncryptor.aes256"]

// ...store/send encryptedBytes + keyFileContent however you like
// (IndexedDB, a fetch() upload, wherever)...

// Reverse direction — pass "" for keyFileContent if the original source
// had no @DLM modules at all (compileWithDlm returned undefined for it;
// "" tells decompileWithDlm to unpack directly rather than attempt
// decryption)
const db = decompileWithDlm(encryptedBytes, keyFileContent ?? "", "my-config");
db.getString("secret"); // "shh"
db.free();`;

  const auditNote = `// If the @DLM section includes DAuditor, the audit trail is backed by
// the browser's localStorage for the current origin instead of a file
// on disk — same reasoning as everything else here, just no filesystem
// to write to. It's keyed by the sourceLabel argument (the second
// argument to both functions above, "my-config" in the example), not a
// path, so audit history persists across compiles as long as you keep
// using the same label for the same logical config.`;
</script>

<div class="doc-page">
  <h1>DLM — Compress, Encrypt &amp; Audit</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    <code>compileWithDlm</code>/<code>decompileWithDlm</code> run a source
    file's <code>@DLM</code> pipeline (compression, encryption, audit
    logging) entirely in memory, mirroring
    <code>DixLoader::compile_with_dlm_from_str</code>/<code>decompile_with_dlm_from_bytes</code>
    on the Rust side.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={dlmApi} lang="javascript" />

  <h2>The audit trail lives in localStorage</h2>
  <CodeBlock code={auditNote} lang="javascript" />

  <div class="tip-callout">
    <strong>What's actually different here</strong>
    <ul>
      <li><strong>No <code>@DLM</code> section is not an error</strong> — <code>compileWithDlm</code> still succeeds on plain source with no <code>@DLM</code> block; <code>processedData()</code> is just the binary-packed AST with nothing applied, and <code>keyFileContent()</code> is <code>undefined</code>. Check <code>executedModules()</code> if you need to know whether anything actually ran.</li>
      <li><strong>Match the empty-key convention on the way back</strong> — pass <code>""</code> (not <code>undefined</code>, not skip the argument) to <code>decompileWithDlm</code> when the original compile had no key content, or it'll try to decrypt data that was never encrypted.</li>
      <li><strong>Avoid assuming the audit trail survives across origins or browsers</strong> — it's plain <code>localStorage</code>, scoped exactly the way any other localStorage data is. It's a real audit trail for one browser profile on one origin, not a durable server-side log.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'compileWithDlm(source, sourceLabel)',      d: 'Compile source and run its @DLM pipeline in memory. Returns MdixDlmOutcome.' },
          { m: 'decompileWithDlm(bytes, keyContent, sourceLabel)', d: 'Reverse — decrypt/decompress bytes back into an MdixDatabase.' },
          { m: 'outcome.isSuccess()',        d: 'boolean' },
          { m: 'outcome.processedData()',    d: 'Uint8Array — the compressed/encrypted (or plain-packed) output.' },
          { m: 'outcome.keyFileContent()',   d: 'string | undefined — the .mdix.key content, undefined if no @DLM modules ran.' },
          { m: 'outcome.executedModules()',  d: 'string[] — which @DLM modules actually ran.' },
          { m: 'outcome.errors() / .warnings()', d: 'string[]' },
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
