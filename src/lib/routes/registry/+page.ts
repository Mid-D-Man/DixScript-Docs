import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch('/api/registry');
    if (!res.ok) return { files: [], error: `API returned ${res.status}` };
    const json = await res.json();
    return { files: json.files ?? [], error: null };
  } catch (e: any) {
    return { files: [], error: e?.message ?? 'Failed to load registry' };
  }
};
