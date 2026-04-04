// src/lib/routes/api/admin/r2/upload/+server.ts
// JWT-authenticated admin upload — replaces the old ADMIN_KEY route for direct admin uploads.
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

  try {
    const form     = await request.formData();
    const file     = form.get('file') as File | null;
    const category = (form.get('category') as string ?? '').trim();
    const desc     = (form.get('desc')     as string ?? '').trim();
    const tags     = (form.get('tags')     as string ?? '').split(',').map(t => t.trim()).filter(Boolean);
    const version  = (form.get('version')  as string ?? '1.0.0').trim();
    const addedBy  = (form.get('addedBy')  as string ?? 'MidManStudio').trim();

    if (!file || !file.name.endsWith('.mdix')) {
      return new Response(JSON.stringify({ ok: false, error: 'A .mdix file is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!category) {
      return new Response(JSON.stringify({ ok: false, error: 'category is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!desc) {
      return new Response(JSON.stringify({ ok: false, error: 'desc is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
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

    return new Response(JSON.stringify({ ok: true, path: r2Key }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[admin r2 upload]', err);
    return new Response(JSON.stringify({ ok: false, error: 'Upload failed.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
