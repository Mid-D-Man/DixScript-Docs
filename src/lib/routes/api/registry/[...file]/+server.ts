import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform, url }) => {
  const bucket = platform?.env?.MDIX_REGISTRY;
  if (!bucket) return new Response('R2 bucket not bound', { status: 500 });

  const filePath = params.file;
  if (!filePath || (!filePath.endsWith('.mdix') && !filePath.endsWith('.meta.json'))) {
    return new Response('Invalid file type', { status: 400 });
  }
  if (filePath.includes('..')) return new Response('Invalid path', { status: 400 });

  try {
    const object = await bucket.get(`packages/${filePath}`);
    if (!object) return new Response(`File not found: ${filePath}`, { status: 404 });

    const filename = filePath.split('/').pop() ?? filePath;
    const isDownload = url.searchParams.has('download');

    const contentType = filePath.endsWith('.meta.json')
      ? 'application/json; charset=utf-8'
      : isDownload
        ? 'application/octet-stream'
        : 'text/plain; charset=utf-8';

    const headers: Record<string, string> = {
      'Content-Type':                contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control':               'public, max-age=3600',
    };

    if (isDownload) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    return new Response(object.body, { headers });
  } catch (err) {
    console.error('[registry get]', err);
    return new Response('Failed to retrieve file', { status: 500 });
  }
};
