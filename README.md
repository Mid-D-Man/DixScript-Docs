# DixScript Docs

Source for [the DixScript documentation and playground site](https://dixscript-docs.pages.dev) —
the docs, interactive playground, community package registry, and CI
results dashboard for [DixScript-Rust](https://github.com/Mid-D-Man/DixScript-Rust).

## What's here

| Route | What it is |
|---|---|
| `/` | Landing page — pitch, syntax comparison, publish status across every language target |
| `/docs` | Language reference, runtime API docs per binding (Rust, C#, Go, Java, Python, PHP, WASM/npm, Odin), CLI, LSP, FFI overview |
| `/playground` | Live in-browser DixScript execution via `@midmanstudio/mdix` (WASM) — load an example from the registry or write your own, with syntax highlighting |
| `/registry` | Community package registry — browse and submit reusable `.mdix` snippets/configs, backed by Cloudflare R2 |
| `/admin` | Moderation view for registry submissions (approve/reject, R2 file management) |
| `/results` | Test results, benchmarks, and flamegraphs pulled from the DixScript-Rust CI pipeline |

## Stack

- **SvelteKit 2** + **Svelte 4**, deployed to **Cloudflare Pages** via
  `@sveltejs/adapter-cloudflare`
- **Prism.js** for syntax highlighting, including a custom `dixscript`
  grammar (`src/lib/prism/custom-languages.ts`) — no official Prism
  grammar exists for `.mdix`, so it's hand-rolled here
- **vite-plugin-wasm** + **vite-plugin-top-level-await** to bundle
  `@midmanstudio/mdix`'s compiled WASM output for the playground
- **Cloudflare R2** (binding `MDIX_REGISTRY`) for the community registry's
  file storage

> **Dependency note:** `vite-plugin-top-level-await` pulls in `@swc/core`
> unpinned. A `@swc/core` patch can break its AST codegen outright (seen
> in production — "missing field `type`" during `generateBundle`). If a
> build starts failing at the `rendering chunks...` step with no changes
> to this repo's own code, check whether a new `@swc/core` shipped and
> bump the pin in `package.json`'s `overrides` to whatever the last
> working version was.

## Docs structure

Each language's runtime API docs live under
`src/lib/components/docs/sections/`. Rust's are split into one component
per feature (`sections/rust/DocRust*.svelte` — Overview, Loading, Query,
Builder, Format Conversion, Schema, Merging, Serde) with the sidebar
(`DocSidebar.svelte`) rendering each as its own page rather than an
anchor inside one long document. Other languages are still single-file
pages under `sections/` and are being migrated to the same per-feature
split incrementally.

`src/lib/routes/docs/+page.svelte` maps every sidebar `id` — top-level
or a language's sub-doc id (`rust-api--builder`) — to exactly one
component. `DocSidebar.svelte`'s `groups` array is the single source of
truth for what's in the sidebar and how it's organized.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build      # production build (Cloudflare adapter output)
npm run check      # svelte-check
```
