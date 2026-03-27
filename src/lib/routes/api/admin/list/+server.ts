import type { RequestHandler } from '@sveltejs/kit';

function checkAuth(request: Request, platform: App.Platform | undefined): boolean {
  const adminKey = platform?.env?.ADMIN_KEY?.trim();
  if (!adminKey) return false;
  const auth = request.headers.get('Authorization') ?? '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  return provided === adminKey && provided.length > 0;
}

export const GET: RequestHandler = async ({ request, platform }) => {
  if (!checkAuth(request, platform)) {
    // Return a hint in dev if ADMIN_KEY simply isn't bound yet
    const keyBound = !!platform?.env?.ADMIN_KEY;
    return new Response(
      JSON.stringify({ error: 'Unauthorized', keyBound }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const bucket = platform?.env?.MDIX_REGISTRY;
  if (!bucket) return new Response(JSON.stringify({ error: 'R2 not bound', files: [] }), { status: 500 });

  try {
    const listed = await bucket.list({ prefix: 'packages/' });
    const mdixObjects = listed.objects.filter(o => o.key.endsWith('.mdix'));

    const files = await Promise.all(
      mdixObjects.map(async (obj) => {
        const metaKey = obj.key.replace('.mdix', '.meta.json');
        let meta: Record<string, unknown> = {};
        try {
          const mo = await bucket.get(metaKey);
          if (mo) meta = JSON.parse(await mo.text());
        } catch { /* no meta */ }

        const subpath  = obj.key.replace('packages/', '');
        const filename = subpath.split('/').pop() ?? subpath;
        return { key: obj.key, name: filename, path: subpath, size: obj.size, uploaded: obj.uploaded?.toISOString() ?? null, ...meta };
      })
    );

    return new Response(JSON.stringify({ files }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[admin list]', err);
    return new Response(JSON.stringify({ error: 'List failed' }), { status: 500 });
  }
};
