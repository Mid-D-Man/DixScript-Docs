import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch('/api/registry');
    if (!res.ok) return { files: [], error: 'API error' };
    const data = await res.json();
    return { files: data.files ?? [], error: null };
  } catch {
    return { files: [], error: 'Failed to load registry' };
  }
};
