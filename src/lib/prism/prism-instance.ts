// src/lib/prism/prism-instance.ts
//
// prismjs's individual language component files (prism-json.js,
// prism-rust.js, etc.) are written expecting a global `Prism` to already
// exist — true when Prism is loaded as concatenated <script> tags, NOT
// guaranteed under ESM bundling. Under Vite/Rollup's SSR build specifically
// (confirmed via a real Cloudflare `workerd` runtime test, not just
// reasoning about it), this throws `ReferenceError: Prism is not defined`
// on the first cold module evaluation of a Worker isolate — which is
// exactly why the site 500s once and then works: the failed isolate gets
// discarded and a fresh request either hits a different, already-warm
// isolate, or Node/Rollup's SSR bundle happens to succeed once module
// state has settled.
//
// Fix: explicitly put Prism on globalThis in its own module, imported
// before any `prismjs/components/*` side-effect import. Because this file
// has no other imports, ES module evaluation order guarantees it fully
// runs before any sibling import that comes after it in the importing
// file — unlike trying to inline `globalThis.Prism = Prism` between two
// import statements, which doesn't work because import statements are
// hoisted above all other top-level code regardless of where they're
// written.
import Prism from 'prismjs';

(globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;

export default Prism;
