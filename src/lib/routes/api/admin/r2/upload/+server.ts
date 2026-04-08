// src/lib/routes/api/admin/r2/upload/+server.ts
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

  try {
    const form     = await request.formData();
    const file     = form.get('file') as File | null;
    const category = (form.get('category') as string ?? '').trim();
    const desc     = (form.get('desc')     as string ?? '').trim();
    const tags     = (form.get('tags')     as string ?? '').split(',').map(t => t.trim()).filter(Boolean);
    const version  = (form.get('version')  as string ?? '1.0.0').trim();
    const addedBy  = (form.get('addedBy')  as string ?? 'MidManStudio').trim();

    if (!file || !file.name.endsWith('.mdix')) {
      return json({ ok: false, error: 'A .mdix file is required.' }, 400, request);
    }

    if (!category) {
      return json({ ok: false, error: 'category is required.' }, 400, request);
    }

    if (!desc) {
      return json({ ok: false, error: 'desc is required.' }, 400, request);
    }

    const filename = file.name;
    const r2Key    = `packages/${category}/${filename}`;
    const metaKey  = r2Key.replace('.mdix', '.meta.json');

    const content = await file.arrayBuffer();
    await bucket.put(r2Key, content, {
      httpMetadata: { contentType: 'text/plain; charset=utf-8' },
    });

    const meta = { desc, tags, category, addedBy, version };
    await bucket.put(metaKey, JSON.stringify(meta, null, 2), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
    });

    return json({ ok: true, path: r2Key }, 201, request);
  } catch (err) {
    console.error('[admin r2 upload]', err);
    return json({ ok: false, error: 'Upload failed.' }, 500, request);
  }
};
