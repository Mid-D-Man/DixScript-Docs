<script lang="ts">
  import '../../app.css';   // fixed path: src/lib/routes → src/app.css
  import { page } from '$app/stores';
  import { mainNav } from '$lib/nav';

  let menuOpen = false;
</script>

<div class="shell">
  <nav class="topnav">
    <div class="nav-inner">
      <a href="/" class="wordmark">
        <span class="wm-accent">Dix</span>Script
        <span class="wm-badge">β</span>
      </a>

      <div class="nav-links" class:open={menuOpen}>
        {#each mainNav as item}
          <a
            href={item.href}
            class="nav-link"
            class:active={$page.url.pathname === item.href ||
              ($page.url.pathname.startsWith(item.href) && item.href !== '/')}
            on:click={() => (menuOpen = false)}
          >
            <span class="nav-icon">{item.icon}</span>
            {item.label}
          </a>
        {/each}

        <a
          href="https://github.com/Mid-D-Man/DixScript-Rust"
          class="nav-link nav-gh"
          target="_blank"
          rel="noopener"
        >
          GitHub ↗
        </a>
      </div>

      <button
        class="hamburger"
        on:click={() => (menuOpen = !menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </div>
  </nav>

  <main class="main-content">
    <slot />
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>DixScript — MidManStudio</span>
      <span class="footer-sep">·</span>
      <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener">GitHub</a>
      <span class="footer-sep">·</span>
      <span>MIT License</span>
      <span class="footer-sep">·</span>
      <span style="color:var(--faint)">Active Development — Not Production Ready</span>
    </div>
  </footer>
</div>

<style>
  .shell { display: flex; flex-direction: column; min-height: 100vh; }
  .topnav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(13,17,23,0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 0 24px; height: 56px;
    gap: 8px;
  }
  .wordmark {
    font-size: 1.2rem; font-weight: 800;
    color: var(--text); text-decoration: none;
    margin-right: 16px; flex-shrink: 0;
    display: flex; align-items: center; gap: 4px;
  }
  .wm-accent { color: var(--accent); }
  .wm-badge {
    font-size: 0.55rem; font-weight: 700; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 4px;
    padding: 1px 5px; color: var(--yellow); align-self: flex-start; margin-top: 4px;
  }
  .nav-links { display: flex; align-items: center; gap: 4px; flex: 1; }
  .nav-link {
    display: flex; align-items: center; gap: 6px;
    color: var(--muted); text-decoration: none;
    padding: 6px 12px; border-radius: 6px;
    font-size: 0.875rem; transition: color .15s, background .15s;
    white-space: nowrap;
  }
  .nav-link:hover { color: var(--text); background: var(--surface2); text-decoration: none; }
  .nav-link.active { color: var(--accent); background: rgba(247,129,102,.08); }
  .nav-icon { font-size: 0.75rem; }
  .nav-gh { margin-left: auto; }
  .hamburger {
    display: none; background: none; border: 1px solid var(--border);
    color: var(--muted); padding: 6px 10px; border-radius: 6px;
    cursor: pointer; font-size: 1rem; margin-left: auto;
  }
  .main-content { flex: 1; }
  .site-footer { border-top: 1px solid var(--border); padding: 20px 24px; }
  .footer-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
    font-size: 0.78rem; color: var(--faint);
  }
  .footer-inner a { color: var(--faint); }
  .footer-inner a:hover { color: var(--muted); }
  .footer-sep { color: var(--border); }
  @media (max-width: 768px) {
    .nav-links {
      display: none; flex-direction: column; align-items: flex-start;
      position: absolute; top: 56px; left: 0; right: 0;
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 12px 16px; gap: 2px;
    }
    .nav-links.open { display: flex; }
    .nav-gh { margin-left: 0; }
    .hamburger { display: block; }
  }
</style>
