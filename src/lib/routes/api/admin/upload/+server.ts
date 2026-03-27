import type { RequestHandler } from '@sveltejs/kit';

function checkAuth(request: Request, platform: App.Platform | undefined): boolean {
  const adminKey = platform?.env?.ADMIN_KEY;
  if (!adminKey) return false;
  return request.headers.get('Authorization') === `Bearer ${adminKey}`;
}

export const POST: RequestHandler = async ({ request, platform }) => {
  if (!checkAuth(request, platform)) return new Response('Unauthorized', { status: 401 });

  const bucket = platform?.env?.MDIX_REGISTRY;
  if (!bucket) return new Response('R2 not bound', { status: 500 });

  try {
    const form     = await request.formData();
    const file     = form.get('file') as File | null;
    const category = (form.get('category') as string ?? '').trim();
    const desc     = (form.get('desc')     as string ?? '').trim();
    const tags     = (form.get('tags')     as string ?? '').split(',').map(t => t.trim()).filter(Boolean);
    const version  = (form.get('version')  as string ?? '1.0.0').trim();
    const addedBy  = (form.get('addedBy')  as string ?? 'MidManStudio').trim();
    const verifyHash = (form.get('verifyHash') as string ?? '').trim() || undefined;

    if (!file || !file.name.endsWith('.mdix') || !category) {
      return new Response('Missing required fields', { status: 400 });
    }

    const filename = file.name;
    const subpath  = `${category}/${filename}`;
    const r2base   = `packages/${subpath}`;

    // Upload .mdix
    const content = await file.arrayBuffer();
    await bucket.put(r2base, content, { httpMetadata: { contentType: 'text/plain; charset=utf-8' } });

    // Upload .meta.json sidecar
    const meta: Record<string, unknown> = { desc, tags, category, addedBy, version };
    if (verifyHash) meta.verifyHash = verifyHash;

    await bucket.put(r2base.replace('.mdix', '.meta.json'), JSON.stringify(meta, null, 2), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' }
    });

    return new Response(JSON.stringify({ ok: true, path: subpath }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[admin upload]', err);
    return new Response('Upload failed', { status: 500 });
  }
};
