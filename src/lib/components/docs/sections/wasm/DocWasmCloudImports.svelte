<!-- src/lib/components/docs/sections/wasm/DocWasmCloudImports.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@IMPORTS(
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game/game_helpers.mdix"
)

@DATA(
  weapon = Helpers.make_weapon("Iron Sword", 25)
)`;

  const prefetchApi = `import { prefetchImport, MdixDatabase } from "@midmanstudio/mdix";

// wasm32-unknown-unknown can't make network requests synchronously, and
// @IMPORTS resolution happens synchronously inside loadStr() — so a
// from_cloud import can't just fetch() itself the moment it's hit.
// prefetchImport primes a cache the resolver checks first, and it's on
// you to fill that cache with a real, normal, async fetch beforehand.

const url = "https://dixscript-docs.pages.dev/api/registry/game/game_helpers.mdix";

const response = await fetch(url);
const content = await response.text();

prefetchImport(url, content); // no network access happens inside wasm at all

// Now loadStr() can resolve the from_cloud import synchronously, since
// it's already sitting in the cache prefetchImport just populated:
const db = MdixDatabase.loadStr(mdixSourceThatImportsFromUrl);`;

  const cacheNote = `// Cached in the browser's localStorage for the current origin — persists
// across page reloads on its own. Call prefetchImport(url, ...) again any
// time you want to force a re-fetch to be picked up; there's no separate
// "evict this one URL" call, and no cache-inspection call either
// (CloudFileCache has clear_cache()/get_statistics() on the Rust side,
// neither is wired through to this binding yet).
//
// No-op on native targets — this function only exists in the wasm build,
// since every other binding just does a real synchronous or async fetch
// itself with no cache indirection needed.`;
</script>

<div class="doc-page">
  <h1>Cloud Imports — prefetchImport</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    A workaround specific to this binding: <code>@IMPORTS(... from_cloud
    "https://...")</code> normally fetches a remote <code>.mdix</code> file
    at compile time (see the language-level <a href="#imports">@IMPORTS</a>
    reference), but <code>wasm32-unknown-unknown</code> can't make a
    synchronous network request, and import resolution happens
    synchronously inside <code>loadStr()</code>. <code>prefetchImport</code>
    is how you bridge that gap.
  </p>

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={prefetchApi} lang="javascript" />

  <h2>Where the cache lives</h2>
  <CodeBlock code={cacheNote} lang="javascript" />

  <div class="tip-callout">
    <strong>Using this correctly</strong>
    <ul>
      <li><strong>Call <code>prefetchImport</code> before <code>loadStr()</code>, every time</strong> — order matters here in a way it doesn't for most of this API. The resolver checks the cache synchronously and simply won't find content that hasn't been prefetched yet, even if you fetch it a moment later.</li>
      <li><strong>The URL passed to <code>prefetchImport</code> must match the <code>from_cloud</code> URL exactly</strong> — it's a cache key, not a fuzzy lookup.</li>
      <li><strong>Avoid re-fetching on every load</strong> if the imported file rarely changes — since the cache already persists across page reloads via localStorage, a one-time prefetch (app startup, first load) is usually enough; call it again only when you specifically want fresher content.</li>
      <li><strong>Every other language binding just does a normal fetch/HTTP call here</strong> — this two-step prefetch-then-load dance is unique to the wasm target specifically because of the synchronous-resolution constraint, not a general DixScript pattern.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        <tr>
          <td><code style="font-size:0.75rem">prefetchImport(url, content)</code></td>
          <td style="color:var(--muted-foreground);font-size:0.8125rem">Primes the cloud-import cache with content for a URL, so a subsequent loadStr() resolving a matching from_cloud import finds it synchronously instead of needing network access. Returns nothing — call it purely for the side effect.</td>
        </tr>
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
