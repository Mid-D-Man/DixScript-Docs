// src/lib/routes/playground/+page.ts
//
// The compiled DixScript WASM module only needs to run in the browser.
// Disabling SSR here sidesteps any question of whether Cloudflare's Worker
// runtime and wasm-pack's bundler-target output play nicely together during
// server rendering — simplest possible fix, and the playground has no SEO
// need for server-rendered content anyway.
export const ssr = false;
