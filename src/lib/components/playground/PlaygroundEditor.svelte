<!-- src/lib/components/playground/PlaygroundEditor.svelte -->
<script lang="ts">
  import Prism from '$lib/prism/prism-instance';
  // Registers the 'dixscript' grammar onto the shared Prism singleton.
  // Prism ships no built-in grammar for .mdix — see this module for the
  // token rules (comments, @SECTION headers, ~quickfuncs, typed generics).
  import '$lib/prism/custom-languages';

  export let source: string = '';

  let textareaEl: HTMLTextAreaElement;
  let preEl: HTMLPreElement;

  // Re-tokenize whenever the source changes. Prism.highlight() is cheap
  // enough to run on every keystroke for playground-sized sources (a few
  // hundred lines at most) — no debouncing needed.
  $: highlighted = highlight(source);

  function highlight(code: string): string {
    const grammar = Prism.languages.dixscript;
    const html = grammar ? Prism.highlight(code, grammar, 'dixscript') : escapeHtml(code);
    // A trailing newline keeps the highlighted layer's line count (and
    // therefore its rendered height) identical to the textarea's own —
    // without it, a source ending in "\n" renders one visual line shorter
    // in the <pre> than in the <textarea>, and the two scroll out of sync.
    return html + '\n';
  }

  function escapeHtml(s: string): string {
    return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
  }

  function syncScroll(): void {
    if (!preEl || !textareaEl) return;
    preEl.scrollTop = textareaEl.scrollTop;
    preEl.scrollLeft = textareaEl.scrollLeft;
  }

  function handleTab(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target as HTMLTextAreaElement;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    source = source.substring(0, start) + '  ' + source.substring(end);
    // Restore cursor after reactive update
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + 2;
    });
  }
</script>

<div class="editor-pane">
  <div class="pane-header">
    <div class="dots" aria-hidden="true">
      <span class="dot dot-r"></span>
      <span class="dot dot-y"></span>
      <span class="dot dot-g"></span>
    </div>
    <span class="pane-title">input.mdix</span>
    <div class="header-badges">
      <span class="lang-badge">DixScript</span>
    </div>
  </div>

  <div class="editor-body">
    <div class="line-numbers" aria-hidden="true">
      {#each source.split('\n') as _line, i}
        <span class="line-num">{i + 1}</span>
      {/each}
    </div>

    <div class="highlight-wrap">
      <pre bind:this={preEl} class="highlight-layer" aria-hidden="true"><code class="language-dixscript">{@html highlighted}</code></pre>
      <textarea
        bind:this={textareaEl}
        class="editor-textarea"
        bind:value={source}
        on:keydown={handleTab}
        on:scroll={syncScroll}
        spellcheck={false}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        aria-label="DixScript source editor"
      ></textarea>
    </div>
  </div>
</div>

<style>
  .editor-pane {
    display: flex;
    flex-direction: column;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    height: 100%;
  }

  .pane-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .dots { display: flex; gap: 5px; flex-shrink: 0; }
  .dot  { width: 11px; height: 11px; border-radius: 50%; }
  .dot-r { background: #f85149; }
  .dot-y { background: #e3b341; }
  .dot-g { background: #3fb950; }

  .pane-title { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--muted-foreground); flex: 1; }

  .header-badges { display: flex; gap: 0.375rem; }
  .lang-badge {
    font-size: 0.625rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    background: rgba(166,124,82,.12); color: var(--primary);
    border: 1px solid rgba(166,124,82,.3);
    padding: 0.15rem 0.5rem; border-radius: 9999px;
    font-family: var(--font-mono);
  }

  .editor-body {
    flex: 1; display: flex; overflow: hidden;
    position: relative;
  }

  .line-numbers {
    display: flex; flex-direction: column;
    padding: 1rem 0.625rem 1rem 1rem;
    background: var(--muted);
    border-right: 1px solid var(--border);
    user-select: none; flex-shrink: 0;
    overflow: hidden;
    min-width: 3rem;
    text-align: right;
  }
  .line-num {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--muted-foreground);
    opacity: 0.5;
    display: block;
  }

  /* Textarea and highlighted <pre> are stacked exactly on top of each
     other — same font, size, line-height, padding, and wrapping — so the
     transparent textarea's caret and selection sit precisely over the
     colored tokens underneath. Only the textarea receives input events;
     the highlight layer is aria-hidden and pointer-events:none. */
  .highlight-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  .highlight-layer,
  .editor-textarea {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 1rem;
    border: none;
    border-radius: 0;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    tab-size: 2;
    white-space: pre;
    overflow: auto;
  }

  .highlight-layer {
    background: var(--card);
    pointer-events: none;
    color: var(--foreground);
  }
  .highlight-layer code {
    background: none;
    padding: 0;
    font-size: inherit;
  }

  .editor-textarea {
    background: transparent;
    color: transparent;
    caret-color: var(--foreground);
  }
  .editor-textarea::selection {
    background: rgba(166, 124, 82, 0.35);
  }

  .editor-textarea:focus {
    outline: none;
  }
</style>
