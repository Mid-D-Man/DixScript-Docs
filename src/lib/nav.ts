export interface NavItem {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
}

export const mainNav: NavItem[] = [
  { href: '/',          label: 'Home',       icon: '◆' },
  { href: '/docs',      label: 'Docs',       icon: '📖' },
  { href: '/playground',label: 'Playground', icon: '⚡' },
  { href: '/registry',  label: 'Registry',   icon: '📦' },
  { href: '/results',   label: 'CI Results', icon: '✅' },
];

export const docsSections = [
  { id: 'intro',       label: 'Introduction'       },
  { id: 'quickstart',  label: 'Quick Start'         },
  { id: 'config',      label: '@CONFIG'             },
  { id: 'enums',       label: '@ENUMS'              },
  { id: 'quickfuncs',  label: '@QUICKFUNCS'         },
  { id: 'data',        label: '@DATA'               },
  { id: 'dlm',         label: '@DLM'                },
  { id: 'security',    label: '@SECURITY'           },
  { id: 'imports',     label: '@IMPORTS'            },
  { id: 'types',       label: 'Data Types'          },
  { id: 'cli',         label: 'CLI Reference'       },
  { id: 'ffi',         label: 'Language Bindings'   },
];

export const CI_BASE = 'https://mid-d-man.github.io/DixScript-Rust';
