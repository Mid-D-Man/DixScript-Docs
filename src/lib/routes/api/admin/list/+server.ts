import type { RequestHandler } from '@sveltejs/kit';

function checkAuth(request: Request, platform: App.Platform | undefined): boolean {
  const adminKey = platform?.env?.ADMIN_KEY;
  if (!adminKey) return false;
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${adminKey}`;
}

export const GET: RequestHandler = async ({ request, platform }) => {
  if (!checkAuth(request, platform)) {
    return new Response('Unauthorized', { status: 401 });
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
    return new Response(JSON.stringify({ error: 'List failed' }), { status: 500 });
  }
};
