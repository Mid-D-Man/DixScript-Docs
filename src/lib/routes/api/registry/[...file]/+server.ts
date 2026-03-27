
import type { RequestHandler } from '@sveltejs/kit';


export const GET: RequestHandler = async ({ params, platform }) => {
  const bucket = platform?.env?.MDIX_REGISTRY;


  if (!bucket) {
    return new Response('R2 bucket not bound', { status: 500 });
  }


  // params.file is the full rest path, e.g. "game/base_types.mdix"
  const filePath = params.file;


  if (!filePath || !filePath.endsWith('.mdix')) {
    return new Response('Invalid file type — only .mdix files may be served', { status: 400 });
  }


  // Prevent path traversal
  if (filePath.includes('..')) {
    return new Response('Invalid path', { status: 400 });
  }


  try {
    const object = await bucket.get(`packages/${filePath}`);


    if (!object) {
      return new Response(`File not found: ${filePath}`, { status: 404 });
    }


    const filename = filePath.split('/').pop() ?? filePath;


    return new Response(object.body, {
      headers: {
        'Content-Type':                 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control':                'public, max-age=3600',
        'Content-Disposition':          `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('[registry get]', err);
    return new Response('Failed to retrieve file', { status: 500 });
  }
};
