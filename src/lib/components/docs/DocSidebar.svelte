<!-- src/lib/components/docs/DocSidebar.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let activeId = 'intro';

  const dispatch = createEventDispatcher<{ navigate: string }>();

  interface NavItem {
    id: string;
    label: string;
  }

  interface NavGroup {
    id: string;
    label: string;
    icon: string;
    items: NavItem[];
    open: boolean;
  }

  let groups: NavGroup[] = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
      open: true,
      items: [
        { id: 'intro',      label: 'Introduction' },
        { id: 'quickstart', label: 'Quick Start'   },
      ]
    },
    {
      id: 'core-concepts',
      label: 'Core Concepts',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
      open: true,
      items: [
        { id: 'types',     label: 'Data Types' },
        { id: 'variables', label: 'Variables'  },
      ]
    },
    {
      id: 'sections',
      label: 'File Sections',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
      open: true,
      items: [
        { id: 'config',     label: '@CONFIG'     },
        { id: 'enums',      label: '@ENUMS'      },
        { id: 'data',       label: '@DATA'       },
        { id: 'quickfuncs', label: '@QUICKFUNCS' },
        { id: 'security',   label: '@SECURITY'   },
        { id: 'dlm',        label: '@DLM'        },
        { id: 'imports',    label: '@IMPORTS'    },
      ]
    },
    {
      id: 'builtins',
      label: 'Built-in API',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
      open: false,
      items: [
        { id: 'builtins-math',     label: 'Math'           },
        { id: 'builtins-array',    label: 'Array'          },
        { id: 'builtins-datetime', label: 'DateTime'       },
        { id: 'builtins-random',   label: 'Random'         },
        { id: 'builtins-string',   label: 'String Methods' },
        { id: 'builtins-number',   label: 'Number Methods' },
        { id: 'builtins-dix',      label: 'Dix Utilities'  },
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Bindings',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
      open: false,
      items: [
        { id: 'cli', label: 'CLI Reference'    },
        { id: 'ffi', label: 'Language Bindings'},
      ]
    },
  ];

  let searchQuery = '';

  $: filteredGroups = searchQuery.trim()
    ? groups.map(g => ({
        ...g,
        open: true,
        items: g.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(g => g.items.length > 0)
    : groups;

  $: {
    if (activeId) {
      groups = groups.map(g => ({
        ...g,
        open: g.items.some(item => item.id === activeId) ? true : g.open
      }));
    }
  }

  function navigate(id: string): void {
    dispatch('navigate', id);
  }

  function toggleGroup(groupId: string): void {
    groups = groups.map(g =>
      g.id === groupId ? { ...g, open: !g.open } : g
    );
  }
</script>

<div class="sidebar">

  <div class="sidebar-header">
    <div class="search-wrap">
      <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
      </svg>
      <input
        type="text"
        placeholder="Search docs..."
        bind:value={searchQuery}
        class="search-input"
        aria-label="Search documentation"
      />
      {#if searchQuery}
        <button class="search-clear" on:click={() => searchQuery = ''} aria-label="Clear search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <nav class="sidebar-nav" aria-label="Documentation navigation">
    {#each filteredGroups as group}
      <div class="nav-group">
        <button
          class="group-header"
          on:click={() => toggleGroup(group.id)}
          aria-expanded={group.open}
        >
          <span class="group-icon" aria-hidden="true">{@html group.icon}</span>
          <span class="group-label">{group.label}</span>
          <svg
            class="group-chevron"
            class:rotated={group.open}
            width="12" height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
        </button>

        {#if group.open}
          <ul class="group-items">
            {#each group.items as item}
              <li>
                <button
                  class="nav-item"
                  class:active={activeId === item.id}
                  on:click={() => navigate(item.id)}
                  aria-current={activeId === item.id ? 'location' : undefined}
                >
                  {item.label}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}

    {#if filteredGroups.length === 0}
      <div class="no-results">No results for "{searchQuery}"</div>
    {/if}
  </nav>

  <div class="sidebar-footer">
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer" class="footer-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.955.005 1.917.128 2.805.374 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub Repository
    </a>
    <a href="/playground" class="footer-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
      </svg>
      Playground
    </a>
  </div>
</div>

<style>
  .sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--background);
  }

  .sidebar-header {
    padding: 1rem 0.75rem 0.75rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 0.625rem;
    color: var(--muted-foreground);
    pointer-events: none;
    flex-shrink: 0;
  }

  .search-input {
    width: 100%;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--foreground);
    font-size: 0.8125rem;
    padding: 0.4375rem 2rem 0.4375rem 2rem;
    outline: none;
    transition: border-color 0.15s;
    font-family: var(--font-sans);
  }

  .search-input:focus { border-color: var(--primary); }
  .search-input::placeholder { color: var(--muted-foreground); }

  .search-clear {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--muted-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 2px;
    transition: color 0.15s;
  }
  .search-clear:hover { color: var(--foreground); }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 0;
  }

  .nav-group { margin-bottom: 2px; }

  .group-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4375rem 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--foreground);
    font-size: 0.8125rem;
    font-weight: 600;
    font-family: var(--font-sans);
    text-align: left;
    transition: background 0.1s;
    border-radius: 4px;
    margin: 0 0.25rem;
    width: calc(100% - 0.5rem);
  }
  .group-header:hover { background: var(--secondary); }

  .group-icon { color: var(--muted-foreground); display: flex; align-items: center; flex-shrink: 0; }
  .group-label { flex: 1; }

  .group-chevron {
    color: var(--muted-foreground);
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  .group-chevron.rotated { transform: rotate(90deg); }

  .group-items {
    list-style: none;
    padding: 0;
    margin: 0 0 0.25rem;
  }

  .nav-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: var(--muted-foreground);
    padding: 0.375rem 0.875rem 0.375rem 2.5rem;
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 400;
    cursor: pointer;
    transition: color 0.12s, background 0.12s;
    line-height: 1.4;
    margin: 0 0.25rem;
    width: calc(100% - 0.5rem);
  }

  .nav-item:hover { color: var(--foreground); background: var(--secondary); }

  .nav-item.active {
    color: var(--primary);
    background: rgba(166, 124, 82, 0.08);
    font-weight: 600;
  }

  .no-results {
    padding: 1.5rem 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }

  .sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .footer-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
    text-decoration: none;
    padding: 0.375rem 0.5rem;
    border-radius: var(--radius);
    transition: color 0.15s, background 0.15s;
  }
  .footer-link:hover { color: var(--foreground); background: var(--secondary); }
</style>
