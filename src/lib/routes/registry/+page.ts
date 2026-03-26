import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch('/api/registry');
    if (!res.ok) return { files: [], error: `API returned ${res.status}` };
    const data = await res.json();
    return { files: data.files ?? [], error: null };
  } catch (e: any) {
    return { files: [], error: e?.message ?? 'Failed to load registry' };
  }
};
