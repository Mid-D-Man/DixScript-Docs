<!-- src/lib/components/docs/sections/wasm/DocWasmHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const watchApi = `import { MdixWatcher } from "@midmanstudio/mdix";

// No filesystem in wasm32-unknown-unknown at all — not a restricted
// one, none — so this can't be a path-watcher like the Python/Go/Java
// bindings. Instead it's a content-hash change detector: YOU already
// know when your source changed (Node's fs.watch, or a browser polling
// its own fetch()) — this just decides cheaply whether newly-read text
// actually differs before paying for a re-parse.
const watcher = new MdixWatcher();

// Node — fs.watch tells you WHEN; this decides WHETHER to re-parse:
fs.watch("config.mdix", async () => {
  const text = await fs.promises.readFile("config.mdix", "utf8");
  const outcome = watcher.check(text);
  if (outcome.changed) applyNewConfig(outcome.database());
});

// Browser — poll your own source:
setInterval(async () => {
  const text = await (await fetch("/config.mdix")).text();
  const outcome = watcher.check(text);
  if (outcome.changed) applyNewConfig(outcome.database());
}, 5000);

// hasChanged() — cheap pre-check by hash only, doesn't parse or update state
watcher.hasChanged(someText);

// reset() — forget previously seen content; the next check() always
// reports changed = true regardless of whether the content matches
watcher.reset();`;
</script>

<div class="doc-page">
  <h1>Hot Reload — Content-Hash Watching</h1>
  <p class="page-lead">
    Part of the <a href="#wasm-api">WebAssembly / JavaScript Runtime API</a>.
    A fundamentally different design from the other bindings' file
    watchers, and deliberately so: <code>wasm32-unknown-unknown</code>
    has no filesystem access at all, in the browser or in Node, so an
    mtime-polling watcher like Python's or Go's simply cannot exist here.
    <code>MdixWatcher</code> instead hashes whatever text you feed it and
    tells you cheaply whether it actually changed since last time — the
    host (Node's <code>fs.watch</code>, or your own <code>fetch()</code>
    poll) still owns knowing *when* to check.
  </p>
  <CodeBlock code={watchApi} lang="javascript" />
</div>
