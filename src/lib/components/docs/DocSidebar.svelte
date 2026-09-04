<!-- src/lib/components/docs/DocSidebar.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let activeSection = 'intro';

  const dispatch = createEventDispatcher<{ navigate: string; close: void }>();

  interface NavItem  { id: string; label: string; children?: NavItem[]; }
  interface NavGroup { id: string; label: string; iconPath: string; items: NavItem[]; open: boolean; }

  // Sub-doc ids: languages with a `children` array render an "Overview"
  // entry (id === the parent's own id, no suffix) plus one entry per
  // feature page, id compound as "<parent-id>--<feature-slug>". Each of
  // these — Overview included — is its OWN standalone component in
  // docs/+page.svelte's render switch, not an anchor inside one big page.
  // Clicking the PARENT ROW itself only ever toggles expand/collapse —
  // see the markup below, where items with children get a non-navigating
  // row and a separate expand button, while children (and Overview) are
  // ordinary navigating buttons.
  let expanded = new Set<string>();

  function toggleExpanded(id: string, e: MouseEvent): void {
    e.stopPropagation();
    expanded = new Set(expanded.has(id) ? [...expanded].filter((x) => x !== id) : [...expanded, id]);
  }

  let groups: NavGroup[] = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      open: true,
      items: [
        { id: 'intro',      label: 'Introduction' },
        { id: 'quickstart', label: 'Quick Start'   },
      ],
    },
    {
      id: 'core-concepts',
      label: 'Core Concepts',
      iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      open: true,
      items: [
        { id: 'types',     label: 'Data Types' },
        { id: 'variables', label: 'Variables'  },
      ],
    },
    {
      id: 'sections',
      label: 'File Sections',
      iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      open: true,
      items: [
        { id: 'config',     label: '@CONFIG'     },
        { id: 'enums',      label: '@ENUMS'      },
        { id: 'data',       label: '@DATA'       },
        { id: 'quickfuncs', label: '@QUICKFUNCS' },
        { id: 'security',   label: '@SECURITY'   },
        { id: 'dlm',        label: '@DLM'        },
        { id: 'imports',    label: '@IMPORTS'    },
      ],
    },
    {
      id: 'builtins',
      label: 'Built-in API',
      iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      open: false,
      items: [
        { id: 'builtin-math',       label: 'Math'            },
        { id: 'builtin-array',      label: 'Array'           },
        { id: 'builtin-datetime',   label: 'DateTime'        },
        { id: 'builtin-random',     label: 'Random'          },
        { id: 'builtin-string',     label: 'String Methods'  },
        { id: 'builtin-number',     label: 'Number Methods'  },
        { id: 'builtin-regex',      label: 'Regex Methods'   },
        { id: 'builtin-tuple',      label: 'Tuple Methods'   },
        { id: 'builtin-blob',       label: 'Blob Methods'    },
        { id: 'builtin-guid',       label: 'Guid'            },
        { id: 'builtin-ipaddress',  label: 'IpAddress'       },
        { id: 'builtin-universal',  label: 'Universal Methods'},
        { id: 'builtin-dix',        label: 'Dix Utilities'   },
      ],
    },
    {
      id: 'tools',
      label: 'Tools & Bindings',
      iconPath: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      open: false,
      items: [
        { id: 'cli',        label: 'CLI Reference'       },
        { id: 'ffi',        label: 'Language Bindings'   },
        { id: 'rust-api',   label: 'Rust Runtime API', children: [
            { id: 'rust-api',                   label: 'Overview'          },
            { id: 'rust-api--loader',           label: 'Loading Files'     },
            { id: 'rust-api--loader-options',   label: 'Loader Options'    },
            { id: 'rust-api--query',            label: 'Querying Data'     },
            { id: 'rust-api--builder',          label: 'Builder API'       },
            { id: 'rust-api--format-conversion',label: 'Format Conversion' },
            { id: 'rust-api--schema-validation',label: 'Schema Validation' },
            { id: 'rust-api--merging',          label: 'Merging Databases' },
            { id: 'rust-api--serde',            label: 'Serde Support'     },
            { id: 'rust-api--hot-reload',       label: 'Hot Reload'        },
          ] },
        { id: 'csharp-api', label: 'C# Runtime API', children: [
            { id: 'csharp-api',                     label: 'Overview'      },
            { id: 'csharp-api--install',         label: 'Install'          },
            { id: 'csharp-api--quickstart',       label: 'Quick Start'      },
            { id: 'csharp-api--error-handling',   label: 'Error Handling'   },
            { id: 'csharp-api--loading',           label: 'Loading Data'     },
            { id: 'csharp-api--reading',            label: 'Reading Values'  },
            { id: 'csharp-api--query',              label: 'Query API'      },
            { id: 'csharp-api--dynamic-access',     label: 'Dynamic Access' },
            { id: 'csharp-api--poco',               label: 'POCO Deserialization' },
            { id: 'csharp-api--enum-codegen',        label: 'Enum Code Generation' },
            { id: 'csharp-api--builder',            label: 'Builder API'    },
            { id: 'csharp-api--merging',            label: 'Merging Databases' },
            { id: 'csharp-api--schema-validation',  label: 'Schema Validation' },
            { id: 'csharp-api--hot-reload',          label: 'Hot Reload'    },
            { id: 'csharp-api--format-conversion',  label: 'Format Conversion' },
            { id: 'csharp-api--method-reference',   label: 'Full Method Reference' },
          ] },
        { id: 'go-api',     label: 'Go Runtime API', children: [
            { id: 'go-api',                     label: 'Overview'          },
            { id: 'go-api--install',            label: 'Install'           },
            { id: 'go-api--quickstart',         label: 'Quick Start'       },
            { id: 'go-api--loading',            label: 'Loading'           },
            { id: 'go-api--reading',            label: 'Reading Values'    },
            { id: 'go-api--error-handling',     label: 'Error Handling'    },
            { id: 'go-api--builder',            label: 'Builder API'       },
            { id: 'go-api--format-conversion',  label: 'Format Conversion' },
            { id: 'go-api--query',              label: 'Query'             },
            { id: 'go-api--schema-validation',  label: 'Schema Validation' },
            { id: 'go-api--merging',            label: 'Merging Databases' },
            { id: 'go-api--hot-reload',         label: 'Hot Reload'        },
            { id: 'go-api--package-layout',     label: 'Package Layout'    },
            { id: 'go-api--method-reference',   label: 'Full Method Reference' },
            { id: 'go-api--vs-csharp',          label: 'vs C#'             },
          ] },
        { id: 'java-api',   label: 'Java Runtime API', children: [
            { id: 'java-api',                     label: 'Overview'          },
            { id: 'java-api--install',            label: 'Install'           },
            { id: 'java-api--quickstart',         label: 'Quick Start'       },
            { id: 'java-api--facade',             label: 'DixScript Facade'  },
            { id: 'java-api--reading',            label: 'Reading Values'    },
            { id: 'java-api--error-handling',     label: 'Error Handling'    },
            { id: 'java-api--builder',            label: 'Builder API'       },
            { id: 'java-api--format-conversion',  label: 'Format Conversion' },
            { id: 'java-api--query',              label: 'Query'             },
            { id: 'java-api--schema-validation',  label: 'Schema Validation' },
            { id: 'java-api--merging',            label: 'Merging Databases' },
            { id: 'java-api--hot-reload',         label: 'Hot Reload'        },
            { id: 'java-api--method-reference',   label: 'Full Method Reference' },
            { id: 'java-api--kotlin',             label: 'Kotlin'            },
          ] },
        { id: 'php-api',    label: 'PHP Runtime API', children: [
            { id: 'php-api',                     label: 'Overview'          },
            { id: 'php-api--install',            label: 'Install'           },
            { id: 'php-api--quickstart',         label: 'Quick Start'       },
            { id: 'php-api--loading',            label: 'Loading'           },
            { id: 'php-api--reading',            label: 'Reading Values'    },
            { id: 'php-api--error-handling',     label: 'Error Handling'    },
            { id: 'php-api--result',             label: 'MdixResult'        },
            { id: 'php-api--builder',            label: 'Builder API'       },
            { id: 'php-api--query',              label: 'Query'             },
            { id: 'php-api--schema-validation',  label: 'Schema Validation' },
            { id: 'php-api--merging',            label: 'Merging Databases' },
            { id: 'php-api--hot-reload',         label: 'Hot Reload'        },
            { id: 'php-api--format-conversion',  label: 'Format Conversion' },
            { id: 'php-api--types',              label: 'Types'             },
            { id: 'php-api--lifecycle',          label: 'Lifecycle & Cleanup' },
            { id: 'php-api--method-reference',   label: 'Full Method Reference' },
          ] },
        { id: 'python-api', label: 'Python Runtime API', children: [
            { id: 'python-api',                  label: 'Overview'          },
            { id: 'python-api--install',         label: 'Install'           },
            { id: 'python-api--quickstart',      label: 'Quick Start'       },
            { id: 'python-api--result',          label: 'MdixResult'        },
            { id: 'python-api--loading',         label: 'Loading'           },
            { id: 'python-api--reading',         label: 'Reading Values'    },
            { id: 'python-api--builder',         label: 'MdixBuilder'       },
            { id: 'python-api--merger',          label: 'MdixMerger'        },
            { id: 'python-api--schema',          label: 'MdixSchemaBuilder' },
            { id: 'python-api--query',           label: 'Query'             },
            { id: 'python-api--hot-reload',      label: 'Hot Reload'        },
            { id: 'python-api--ml-extras',       label: 'ML Extras'         },
          ] },
        { id: 'wasm-api',   label: 'WASM / JS Runtime API', children: [
            { id: 'wasm-api',                     label: 'Overview'          },
            { id: 'wasm-api--install',            label: 'Install'           },
            { id: 'wasm-api--quickstart',         label: 'Quick Start'       },
            { id: 'wasm-api--reading',            label: 'Reading Values'    },
            { id: 'wasm-api--result-pattern',     label: 'The Result Pattern' },
            { id: 'wasm-api--builder',            label: 'Building Programmatically' },
            { id: 'wasm-api--format-conversion',  label: 'Format Conversion' },
            { id: 'wasm-api--query',              label: 'Query'             },
            { id: 'wasm-api--merging',            label: 'Merging Databases' },
            { id: 'wasm-api--schema-validation',  label: 'Schema Validation' },
            { id: 'wasm-api--hot-reload',         label: 'Hot Reload'        },
            { id: 'wasm-api--dlm',                label: 'DLM (Compress/Encrypt/Audit)' },
            { id: 'wasm-api--cloud-imports',      label: 'Cloud Imports'     },
          ] },
        { id: 'odin-api',   label: 'Odin Runtime API', children: [
            { id: 'odin-api',                    label: 'Overview'                    },
            { id: 'odin-api--build-link',        label: 'Build & Link'                },
            { id: 'odin-api--quickstart',        label: 'Quick Start'                 },
            { id: 'odin-api--value-ok',          label: 'The (value, ok) Pattern'      },
            { id: 'odin-api--loading',           label: 'Loading'                     },
            { id: 'odin-api--reading',           label: 'Reading Values'              },
            { id: 'odin-api--export',            label: 'Export & Source Transforms'  },
            { id: 'odin-api--builder',           label: 'Building Programmatically'   },
            { id: 'odin-api--query',             label: 'Query'                       },
            { id: 'odin-api--schema',            label: 'Schema Validation'           },
            { id: 'odin-api--merging',           label: 'Merging Databases'           },
            { id: 'odin-api--hot-reload',        label: 'Hot Reload'                  },
            { id: 'odin-api--method-reference',  label: 'Full Method Reference'       },
            { id: 'odin-api--vs-c',              label: 'vs the raw C API'            },
          ] },
        { id: 'c-api',      label: 'C / C++ Runtime API', children: [
            { id: 'c-api',                       label: 'Overview'                    },
            { id: 'c-api--build-link',           label: 'Build & Link'                },
            { id: 'c-api--quickstart-c',         label: 'Quick Start (C)'             },
            { id: 'c-api--quickstart-cpp',       label: 'Quick Start (C++)'           },
            { id: 'c-api--error-handling',       label: 'Error Handling & Ownership'  },
            { id: 'c-api--reading',              label: 'Reading Values'              },
            { id: 'c-api--encrypted',            label: 'Encrypted Loading'           },
            { id: 'c-api--builder',              label: 'Builder API'                 },
            { id: 'c-api--query',                label: 'Query'                       },
            { id: 'c-api--merging',              label: 'Merging Databases'           },
            { id: 'c-api--hot-reload',           label: 'Hot Reload'                  },
            { id: 'c-api--format-conversion',    label: 'Format & Conversion'         },
          ] },
      ],
    },
  ];

  let search = '';

  $: filtered = search.trim()
    ? groups
        .map(g => ({
          ...g,
          open: true,
          items: g.items
            .map((i): NavItem | null => {
              const q = search.toLowerCase();
              const selfMatch = i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
              if (selfMatch) return i;
              const matchedChildren = (i.children ?? []).filter(
                c => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
              );
              if (matchedChildren.length > 0) return { ...i, children: matchedChildren };
              return null;
            })
            .filter((i): i is NavItem => i !== null),
        }))
        .filter(g => g.items.length > 0)
    : groups;

  // While searching, auto-expand any item whose children matched.
  $: if (search.trim()) {
    expanded = new Set([
      ...expanded,
      ...filtered.flatMap(g => g.items).filter(i => i.children?.length).map(i => i.id),
    ]);
  }

  $: if (activeSection) {
    const parentId = activeSection.split('--')[0];
    groups = groups.map(g => ({
      ...g,
      open: g.items.some(i => i.id === parentId) ? true : g.open,
    }));
    const parentItem = groups.flatMap(g => g.items).find(i => i.id === parentId && i.children);
    if (parentItem) {
      expanded = new Set([...expanded, parentId]);
    }
  }

  function navigate(id: string): void { dispatch('navigate', id); }
  function close(): void { dispatch('close'); }
  function toggle(id: string): void {
    groups = groups.map(g => (g.id === id ? { ...g, open: !g.open } : g));
  }
</script>

<div class="sidebar-wrap">

  <div class="sidebar-head">
    <span class="sidebar-title">Documentation</span>
    <button class="close-btn" on:click={close} aria-label="Close navigation">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <div class="search-wrap">
    <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
    </svg>
    <input
      type="text"
      placeholder="Search docs..."
      class="search-input"
      bind:value={search}
      aria-label="Search documentation"
    />
    {#if search}
      <button class="search-clear" on:click={() => (search = '')} aria-label="Clear">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      </button>
    {/if}
  </div>

  <nav class="nav" aria-label="Documentation sections">
    {#each filtered as group}
      <div class="nav-group">
        <button
          class="group-btn"
          on:click={() => toggle(group.id)}
          aria-expanded={group.open}
        >
          <svg class="group-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d={group.iconPath}/>
          </svg>
          <span class="group-label">{group.label}</span>
          <svg
            class="chevron"
            class:open={group.open}
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
                {#if item.children}
                  <!-- Parent row never navigates — it only opens/closes the
                       dropdown. "Overview" (first child, id === item.id)
                       is the only way to reach a top-level view for this
                       language, same as any other child. -->
                  <button
                    class="nav-item nav-item--parent"
                    class:parent-active={activeSection.split('--')[0] === item.id}
                    on:click={(e) => toggleExpanded(item.id, e)}
                    aria-expanded={expanded.has(item.id)}
                  >
                    <svg
                      class="expand-chevron"
                      class:open={expanded.has(item.id)}
                      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                    </svg>
                    {item.label}
                  </button>

                  {#if expanded.has(item.id)}
                    <ul class="sub-items">
                      {#each item.children as child}
                        <li>
                          <button
                            class="nav-item nav-item--sub"
                            class:active={activeSection === child.id}
                            on:click={() => navigate(child.id)}
                            aria-current={activeSection === child.id ? 'location' : undefined}
                          >
                            {child.label}
                          </button>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                {:else}
                  <button
                    class="nav-item"
                    class:active={activeSection === item.id}
                    on:click={() => navigate(item.id)}
                    aria-current={activeSection === item.id ? 'location' : undefined}
                  >
                    {item.label}
                  </button>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}

    {#if filtered.length === 0}
      <p class="no-results">No results for "{search}"</p>
    {/if}
  </nav>

  <div class="sidebar-footer">
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer" class="footer-link">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.955.005 1.917.128 2.805.374 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub
    </a>
    <a href="/playground" class="footer-link">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
      </svg>
      Playground
    </a>
  </div>
</div>

<style>
  .sidebar-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--background);
  }

  .sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0.875rem 0.75rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .sidebar-title {
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted-foreground);
    font-family: var(--font-mono);
  }

  .close-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 1.875rem;
    height: 1.875rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--muted-foreground);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .close-btn:hover { background: var(--muted); color: var(--foreground); }

  .search-wrap {
    position: relative;
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted-foreground);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--foreground);
    font-size: 0.8125rem;
    padding: 0.4375rem 2rem 0.4375rem 2.125rem;
    outline: none;
    font-family: var(--font-sans);
    transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--primary); }
  .search-input::placeholder { color: var(--muted-foreground); }

  .search-clear {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--muted-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color 0.15s;
  }
  .search-clear:hover { color: var(--foreground); }

  .nav {
    flex: 1;
    overflow-y: auto;
    padding: 0.375rem 0;
  }

  .nav-group { margin-bottom: 1px; }

  .group-btn {
    width: calc(100% - 0.75rem);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4375rem 0.625rem;
    margin: 0 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--foreground);
    font-size: 0.8125rem;
    font-weight: 600;
    font-family: var(--font-sans);
    text-align: left;
    border-radius: 4px;
    transition: background 0.1s;
  }
  .group-btn:hover { background: var(--secondary); }

  .group-icon { color: var(--muted-foreground); flex-shrink: 0; }
  .group-label { flex: 1; }

  .chevron {
    color: var(--muted-foreground);
    flex-shrink: 0;
    transition: transform 0.18s ease;
  }
  .chevron.open { transform: rotate(90deg); }

  .group-items {
    list-style: none;
    padding: 0;
    margin: 0 0 0.25rem;
  }

  .nav-item {
    display: block;
    width: calc(100% - 0.75rem);
    text-align: left;
    background: none;
    border: none;
    color: var(--muted-foreground);
    padding: 0.375rem 0.75rem 0.375rem 2.25rem;
    margin: 0 0.375rem;
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: color 0.12s, background 0.12s;
    line-height: 1.4;
  }
  .nav-item:hover { color: var(--foreground); background: var(--secondary); }
  .nav-item.active {
    color: var(--primary);
    background: rgba(166, 124, 82, 0.1);
    font-weight: 600;
  }
  .nav-item.parent-active { color: var(--foreground); font-weight: 600; }

  .nav-item--parent {
    display: flex; align-items: center; gap: 0.375rem;
    padding-left: 1.5rem;
  }

  .expand-chevron {
    color: var(--muted-foreground); flex-shrink: 0;
    transition: transform 0.18s ease;
  }
  .expand-chevron.open { transform: rotate(90deg); }

  .sub-items {
    list-style: none;
    padding: 0;
    margin: 0 0 0.125rem;
  }
  .nav-item--sub {
    padding-left: 3.5rem;
    font-size: 0.75rem;
  }

  .no-results {
    padding: 1.25rem 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }

  .sidebar-footer {
    padding: 0.625rem 0.75rem;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
    text-decoration: none;
    padding: 0.3125rem 0.5rem;
    border-radius: var(--radius);
    transition: color 0.15s, background 0.15s;
  }
  .footer-link:hover { color: var(--foreground); background: var(--secondary); }

  @media (max-width: 900px) {
    .close-btn { display: flex; }
  }
</style>
