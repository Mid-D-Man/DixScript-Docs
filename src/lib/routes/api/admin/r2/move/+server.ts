// src/lib/routes/api/admin/r2/move/+server.ts
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

  let fromKey: string;
  let toKey: string;
  try {
    const body = await request.json() as { from_key?: string; to_key?: string };
    fromKey = body.from_key?.trim() ?? '';
    toKey   = body.to_key?.trim()   ?? '';
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400, request);
  }

  if (!fromKey || !toKey) {
    return json({ ok: false, error: 'from_key and to_key are required.' }, 400, request);
  }

  for (const k of [fromKey, toKey]) {
    if (k.includes('..')) {
      return json({ ok: false, error: `Invalid key: ${k}` }, 400, request);
    }
  }

  try {
    const obj = await bucket.get(fromKey);
    if (!obj) {
      return json({ ok: false, error: `Source not found: ${fromKey}` }, 404, request);
    }

    const body = await obj.arrayBuffer();
    await bucket.put(toKey, body, { httpMetadata: obj.httpMetadata });
    await bucket.delete(fromKey);

    if (fromKey.endsWith('.mdix')) {
      const fromMeta = fromKey.replace('.mdix', '.meta.json');
      const toMeta   = toKey.replace('.mdix', '.meta.json');
      try {
        const metaObj = await bucket.get(fromMeta);
        if (metaObj) {
          const metaBody = await metaObj.arrayBuffer();
          await bucket.put(toMeta, metaBody, { httpMetadata: metaObj.httpMetadata });
          await bucket.delete(fromMeta);
        }
      } catch { /* non-fatal */ }
    }

    return json({ ok: true }, 200, request);
  } catch (err) {
    console.error('[admin r2 move]', err);
    return json({ ok: false, error: 'Move failed.' }, 500, request);
  }
};
