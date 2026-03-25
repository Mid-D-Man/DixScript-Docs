import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const { subscribe, set } = writable<Theme>('light');

function applyTheme(t: Theme): void {
  document.documentElement.classList.toggle('dark', t === 'dark');
}

function init(): void {
  if (!browser) return;
  const stored = localStorage.getItem('dixscript-theme') as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved: Theme = stored ?? (prefersDark ? 'dark' : 'light');
  applyTheme(resolved);
  set(resolved);
}

function toggle(): void {
  if (!browser) return;
  const isDark = document.documentElement.classList.contains('dark');
  const next: Theme = isDark ? 'light' : 'dark';
  localStorage.setItem('dixscript-theme', next);
  applyTheme(next);
  set(next);
}

export const theme = { subscribe, init, toggle };
