<!-- src/lib/components/CodeBlock.svelte -->
<script lang="ts">
  import Prism from '$lib/prism/prism-instance';
  // Prism's official language components — each registers itself on import.
  import 'prismjs/components/prism-markup';
  // php's component registers a global before-tokenize hook that expects
  // markup-templating to already exist — without this, EVERY highlight()
  // call throws, not just php ones, since the hook runs unconditionally.
  import 'prismjs/components/prism-markup-templating';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-rust';
  import 'prismjs/components/prism-csharp';
  import 'prismjs/components/prism-go';
  import 'prismjs/components/prism-java';
  import 'prismjs/components/prism-kotlin';
  import 'prismjs/components/prism-php';
  import 'prismjs/components/prism-python';
  import 'prismjs/components/prism-lua';
  import 'prismjs/components/prism-toml';
  import 'prismjs/components/prism-json';
  import 'prismjs/components/prism-bash';
  import 'prismjs/components/prism-typescript';
  import 'prismjs/components/prism-javascript';
  // Our own grammars — Prism ships neither of these.
  import './../prism/custom-languages';

  export let code: string;
  export let lang: string = 'text';
  export let filename: string | null = null;

  $: grammar = Prism.languages[lang] ?? Prism.languages.text ?? { text: /.*/ };
  $: highlighted = lang === 'text' ? escapeHtml(code) : Prism.highlight(code, grammar, lang);

  function escapeHtml(s: string): string {
    return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
  }

  let copied = false;
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      // clipboard API unavailable — fail silently, no crash
    }
  }
</script>

<div class="code-block">
  {#if filename}
    <div class="code-filename">{filename}</div>
  {/if}
  <button class="copy-btn" on:click={copyCode} aria-label="Copy code">
    {#if copied}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
      </svg>
      Copied
    {:else}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/>
      </svg>
      Copy
    {/if}
  </button>
  <pre class="language-{lang}"><code class="language-{lang}">{@html highlighted}</code></pre>
</div>

<style>
  .code-block {
    position: relative;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card, var(--secondary));
    overflow: hidden;
    margin: 0.875rem 0 1.25rem;
  }

  .code-filename {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted-foreground);
    padding: 0.5rem 0.875rem;
    border-bottom: 1px solid var(--border);
    background: var(--secondary);
  }

  .copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--muted-foreground);
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, color 0.15s ease;
    z-index: 1;
  }
  .code-block:hover .copy-btn,
  .copy-btn:focus-visible {
    opacity: 1;
  }
  .copy-btn:hover {
    color: var(--foreground);
  }

  pre {
    margin: 0;
    padding: 1rem 1.125rem;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.65;
    background: transparent;
  }
  code {
    font-family: inherit;
    background: none;
  }
</style>
