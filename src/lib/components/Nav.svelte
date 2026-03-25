<script lang="ts">
  import { page } from '$app/stores';
  import { theme } from '$lib/stores/theme';

  let menuOpen = false;

  const navItems = [
    { label: 'Docs',       href: '/docs'       },
    { label: 'Playground', href: '/playground' },
    { label: 'Registry',   href: '/registry'   },
    { label: 'CI Results', href: '/results'    },
  ];

  function isActive(href: string): boolean {
    if (href === '/') return $page.url.pathname === '/';
    return $page.url.pathname.startsWith(href);
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<nav class="nav" aria-label="Main navigation">
  <div class="nav-inner">

    <!-- Brand -->
    <div class="brand">
      <button
        class="theme-btn"
        on:click={theme.toggle}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        D
      </button>
      <a href="/" class="brand-name" on:click={closeMenu}>DixScript</a>
    </div>

    <!-- Desktop links -->
    <div class="nav-links" class:open={menuOpen}>
    {#each navItems as item}
  <a
    href={item.href}
    class="nav-link"
    class:active={isActive(item.href)}
    on:click={closeMenu}
  >
    {item.label}
  </a>
{/each}


      <a
  href="https://github.com/Mid-D-Man/DixScript-Rust"
  class="nav-link github-link"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub repository"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387..."/>
  </svg>
  <span class="gh-label">GitHub</span>
</a>

    </div>

    <!-- Mobile hamburger -->
    <button
      class="hamburger"
      on:click={() => menuOpen = !menuOpen}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
    >
      {#if menuOpen}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      {:else}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      {/if}
    </button>

  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
    transition: background-color 0.3s ease;
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 4rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* ── Brand ── */
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .theme-btn {
    width: 2rem;
    height: 2rem;
    background: var(--accent);
    color: var(--accent-foreground);
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, color 0.15s ease;
    flex-shrink: 0;
  }

  .theme-btn:hover {
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .brand-name {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--foreground);
    transition: color 0.15s ease;
  }

  .brand-name:hover {
    color: var(--primary);
  }

  /* ── Nav links ── */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    margin-left: auto;
  }

  .nav-link {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    border-radius: var(--radius);
    transition: color 0.15s ease, background 0.15s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .nav-link:hover {
    color: var(--primary);
    background: var(--secondary);
  }

  .nav-link.active {
    color: var(--primary);
    background: var(--muted);
  }

  .github-link {
    color: var(--muted-foreground);
  }

  .gh-label {
    display: none;
  }

  /* ── Hamburger ── */
  .hamburger {
    display: none;
    background: none;
    border: 1px solid var(--border);
    color: var(--foreground);
    padding: 0.375rem 0.5rem;
    border-radius: var(--radius);
    cursor: pointer;
    margin-left: auto;
    transition: background 0.15s ease;
    line-height: 0;
  }

  .hamburger:hover {
    background: var(--secondary);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hamburger {
      display: flex;
      align-items: center;
    }

    .nav-links {
      display: none;
      position: absolute;
      top: 4rem;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      background: var(--background);
      border-bottom: 1px solid var(--border);
      padding: 0.5rem 1rem;
      gap: 0.25rem;
      margin-left: 0;
      z-index: 50;
    }

    .nav-links.open {
      display: flex;
    }

    .github-link {
      display: flex;
    }

    .gh-label {
      display: inline;
    }
  }
</style>
