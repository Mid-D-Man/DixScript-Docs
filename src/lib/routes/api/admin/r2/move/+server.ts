// src/lib/routes/api/admin/r2/move/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, platform }) => {
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

  let fromKey: string;
  let toKey: string;
  try {
    const body = await request.json() as { from_key?: string; to_key?: string };
    fromKey = body.from_key?.trim() ?? '';
    toKey   = body.to_key?.trim()   ?? '';
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!fromKey || !toKey) {
    return new Response(JSON.stringify({ ok: false, error: 'from_key and to_key are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  for (const k of [fromKey, toKey]) {
    if (k.includes('..')) {
      return new Response(JSON.stringify({ ok: false, error: `Invalid key: ${k}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    // Move main file
    const obj = await bucket.get(fromKey);
    if (!obj) {
      return new Response(JSON.stringify({ ok: false, error: `Source not found: ${fromKey}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await obj.arrayBuffer();
    await bucket.put(toKey, body, {
      httpMetadata: obj.httpMetadata,
    });
    await bucket.delete(fromKey);

    // Move sidecar if present
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
      } catch {
        // Non-fatal
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[admin r2 move]', err);
    return new Response(JSON.stringify({ ok: false, error: 'Move failed.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
