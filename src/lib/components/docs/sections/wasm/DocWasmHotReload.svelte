<!-- src/lib/components/docs/sections/wasm/DocWasmHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@DATA(
  app_name = "MyApp"
  debug<bool> = false
)

// Edit and save this file (or its remote copy) while the code below is
// running to see a change actually get picked up.`;

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
  if (outcome.changed) {
    applyNewConfig(outcome.database()); // only valid once, see below
  }
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

  const outcomeGotcha = `const outcome = watcher.check(text);

outcome.changed;      // property access — fine to read repeatedly
outcome.database();   // METHOD call — consumes the result, only works ONCE

if (outcome.changed) {
  const db1 = outcome.database(); // ok
  const db2 = outcome.database(); // throws — already taken
}
// Calling .database() when outcome.changed is false also throws —
// there's nothing to take in that case. Always check .changed first.`;
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

  <h2>Example .mdix file</h2>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={watchApi} lang="javascript" />

  <div class="tip-callout">
    <strong>outcome.database() is consumed on first call</strong>
    <p>It's a method, not a getter, and it takes the parsed database out of the outcome — call it more than once, or when nothing actually changed, and it throws.</p>
    <CodeBlock code={outcomeGotcha} lang="javascript" />
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'new MdixWatcher()',        d: 'Create a watcher with no prior content seen — the first check()/hasChanged() always reports changed.' },
          { m: '.hasChanged(source)',       d: 'boolean — hash-only pre-check, doesn\'t parse or update state.' },
          { m: '.check(source)',            d: 'Reparses if changed, updates internal state either way. Returns MdixWatchOutcome.' },
          { m: '.reset()',                  d: 'Forgets previously seen content — next check() always reports a change.' },
          { m: 'outcome.changed',           d: 'getter -> boolean.' },
          { m: 'outcome.database()',        d: 'Method, not a getter. Consumes and returns the parsed MdixDatabase. Throws if changed was false or if already called once.' },
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
  .tip-callout strong { color: var(--foreground); display: block; margin-bottom: 0.375rem; }
  .tip-callout p { color: var(--muted-foreground); line-height: 1.6; margin: 0 0 0.75rem; }
</style>
