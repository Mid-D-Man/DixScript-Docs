import type { RequestHandler } from '@sveltejs/kit';

function checkAuth(request: Request, platform: App.Platform | undefined): boolean {
  const adminKey = platform?.env?.ADMIN_KEY?.trim();
  if (!adminKey) return false;
  const auth = request.headers.get('Authorization') ?? '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  return provided === adminKey && provided.length > 0;
}

export const DELETE: RequestHandler = async ({ request, platform }) => {
  if (!checkAuth(request, platform)) return new Response('Unauthorized', { status: 401 });

  const bucket = platform?.env?.MDIX_REGISTRY;
  if (!bucket) return new Response('R2 not bound', { status: 500 });

  try {
    const { path } = await request.json() as { path: string };
    if (!path || path.includes('..') || !path.endsWith('.mdix')) {
      return new Response('Invalid path', { status: 400 });
    }

    const r2key  = `packages/${path}`;
    const metaKey = r2key.replace('.mdix', '.meta.json');

    await bucket.delete(r2key);
    try { await bucket.delete(metaKey); } catch { /* ok if no meta */ }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[admin delete]', err);
    return new Response('Delete failed', { status: 500 });
  }
};
