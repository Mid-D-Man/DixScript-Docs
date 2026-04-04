// src/lib/routes/api/admin/r2/delete/+server.ts
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

  let key: string;
  try {
    const body = await request.json() as { key?: string };
    key = body.key?.trim() ?? '';
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!key) {
    return new Response(JSON.stringify({ ok: false, error: 'key is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (key.includes('..')) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid key.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!key.endsWith('.mdix') && !key.endsWith('.meta.json')) {
    return new Response(JSON.stringify({ ok: false, error: 'Key must end in .mdix or .meta.json.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await bucket.delete(key);

    // Also delete sidecar if deleting the .mdix
    if (key.endsWith('.mdix')) {
      const metaKey = key.replace('.mdix', '.meta.json');
      try { await bucket.delete(metaKey); } catch { /* ok if missing */ }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[admin r2 delete]', err);
    return new Response(JSON.stringify({ ok: false, error: 'Delete failed.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
