// src/lib/routes/api/admin/r2/list/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';

export const GET: RequestHandler = async ({ request, url, platform }) => {
  const auth = await verifyAdminJwt(request, platform);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const bucket = platform?.env?.MDIX_REGISTRY;
  if (!bucket) {
    return new Response(JSON.stringify({ ok: false, error: 'R2 bucket not bound.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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

    return new Response(JSON.stringify({ files }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[admin r2 list]', err);
    return new Response(JSON.stringify({ ok: false, error: 'Failed to list R2 bucket.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
