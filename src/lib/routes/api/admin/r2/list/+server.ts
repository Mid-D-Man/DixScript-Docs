// src/lib/routes/api/admin/r2/list/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';
import { preflight, json } from '$lib/server/cors';

export const OPTIONS: RequestHandler = async ({ request }) => {
  return preflight(request) ?? new Response(null, { status: 204 });
};

export const GET: RequestHandler = async ({ request, url, platform }) => {
  const pre = preflight(request);
  if (pre) return pre;

  const auth = await verifyAdminJwt(request, platform);
  if (!auth.ok) {
    return json({ ok: false, error: auth.error }, 403, request);
  }

  const bucket = platform?.env?.MDIX_REGISTRY;
  if (!bucket) {
    return json({ ok: false, error: 'R2 bucket not bound.' }, 500, request);
  }

  const prefix = url.searchParams.get('prefix') ?? '';

  try {
    const listed = await bucket.list({ prefix: prefix || undefined });

    const files = listed.objects.map((obj) => {
      const segments = obj.key.split('/');
      const name     = segments[segments.length - 1];
      return {
        key:      obj.key,
        name,
        size:     obj.size,
        uploaded: obj.uploaded?.toISOString() ?? null,
        is_meta:  obj.key.endsWith('.meta.json'),
      };
    });

    return json({ files }, 200, request);
  } catch (err) {
    console.error('[admin r2 list]', err);
    return json({ ok: false, error: 'Failed to list R2 bucket.' }, 500, request);
  }
};
