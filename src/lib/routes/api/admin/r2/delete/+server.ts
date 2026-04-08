// src/lib/routes/api/admin/r2/delete/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';
import { preflight, json } from '$lib/server/cors';

export const OPTIONS: RequestHandler = async ({ request }) => {
  return preflight(request) ?? new Response(null, { status: 204 });
};

export const POST: RequestHandler = async ({ request, platform }) => {
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

  let key: string;
  try {
    const body = await request.json() as { key?: string };
    key = body.key?.trim() ?? '';
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400, request);
  }

  if (!key) {
    return json({ ok: false, error: 'key is required.' }, 400, request);
  }

  if (key.includes('..')) {
    return json({ ok: false, error: 'Invalid key.' }, 400, request);
  }

  if (!key.endsWith('.mdix') && !key.endsWith('.meta.json')) {
    return json(
      { ok: false, error: 'Key must end in .mdix or .meta.json.' },
      400,
      request,
    );
  }

  try {
    await bucket.delete(key);

    if (key.endsWith('.mdix')) {
      const metaKey = key.replace('.mdix', '.meta.json');
      try { await bucket.delete(metaKey); } catch { /* ok if missing */ }
    }

    return json({ ok: true }, 200, request);
  } catch (err) {
    console.error('[admin r2 delete]', err);
    return json({ ok: false, error: 'Delete failed.' }, 500, request);
  }
};
