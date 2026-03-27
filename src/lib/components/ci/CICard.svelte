<!-- src/lib/components/ci/CICard.svelte -->
<script lang="ts">
  export let title: string;
  export let desc: string;
  export let href: string;
  export let lang: string;
  export let iconPath: string;
</script>

<a class="ci-card" {href} target="_blank" rel="noopener noreferrer">
  <div class="ci-card-icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
      <path stroke-linecap="round" stroke-linejoin="round" d={iconPath}/>
    </svg>
  </div>
  <div class="ci-card-body">
    <div class="ci-card-title">{title}</div>
    <div class="ci-card-desc">{desc}</div>
  </div>
  <div class="ci-card-right">
    <span class="lang-chip lang-chip--{lang}">{lang}</span>
    <svg class="ci-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
    </svg>
  </div>
</a>

<style>
  .ci-card {
    display: flex; align-items: flex-start; gap: 1rem;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.125rem 1.25rem;
    text-decoration: none; color: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
    position: relative;
  }
  .ci-card:hover { border-color: var(--primary); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  .ci-card-icon {
    width: 2.5rem; height: 2.5rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    color: var(--primary);
  }

  .ci-card-body { flex: 1; min-width: 0; }
  .ci-card-title { font-family: var(--font-serif); font-size: 0.9375rem; font-weight: 700; color: var(--foreground); margin-bottom: 0.3rem; }
  .ci-card-desc  { font-size: 0.8125rem; color: var(--muted-foreground); line-height: 1.55; }

  .ci-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.625rem; flex-shrink: 0; }

  .lang-chip {
    font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; padding: 0.2rem 0.625rem; border-radius: 9999px;
    font-family: var(--font-mono); border: 1px solid; white-space: nowrap;
  }
  .lang-chip--rust   { background: rgba(206,108,34,.12); color: #c05a10; border-color: rgba(206,108,34,.3);  }
  .lang-chip--python { background: rgba(46,168,160,.12); color: #1d8a83; border-color: rgba(46,168,160,.3);  }
  .lang-chip--go     { background: rgba(88,166,255,.12); color: #3a72c4; border-color: rgba(88,166,255,.3);  }
  .lang-chip--java   { background: rgba(200,130,40,.12); color: #9a5f10; border-color: rgba(200,130,40,.3);  }
  .lang-chip--php    { background: rgba(136,146,191,.12);color: #5a6aa0; border-color: rgba(136,146,191,.3); }
  .lang-chip--cs     { background: rgba(155,77,202,.12); color: #7a35b0; border-color: rgba(155,77,202,.3);  }
  .lang-chip--bench  { background: rgba(166,124,82,.12); color: var(--primary); border-color: rgba(166,124,82,.3); }
  .lang-chip--test   { background: var(--secondary); color: var(--muted-foreground); border-color: var(--border); }

  .ci-arrow { color: var(--muted-foreground); flex-shrink: 0; }
</style>
