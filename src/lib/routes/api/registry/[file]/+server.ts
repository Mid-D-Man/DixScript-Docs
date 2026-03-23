import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform }) => {
  const bucket = platform?.env?.MDIX_REGISTRY;

  if (!bucket) {
    return new Response('R2 bucket not bound', { status: 500 });
  }

  const filename = params.file;

  // Basic safety check — only serve .mdix files
  if (!filename || !filename.endsWith('.mdix')) {
    return new Response('Invalid file type', { status: 400 });
  }

  try {
    const object = await bucket.get(`packages/${filename}`);

    if (!object) {
      return new Response(`File not found: ${filename}`, { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err) {
    return new Response('Failed to retrieve file', { status: 500 });
  }
};
