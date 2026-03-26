import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform }) => {
  const bucket = platform?.env?.MDIX_REGISTRY;

  if (!bucket) {
    return new Response(
      JSON.stringify({ error: 'R2 bucket not bound', files: [] }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }

  try {
    const listed = await bucket.list({ prefix: 'packages/' });

    const files = listed.objects
      .filter((obj) => obj.key.endsWith('.mdix'))
      .map((obj) => ({
        key:         obj.key,
        name:        obj.key.replace('packages/', ''),
        size:        obj.size,
        uploaded:    obj.uploaded?.toISOString() ?? null,
        downloadUrl: `/api/registry/${obj.key.replace('packages/', '')}`
      }));

    return new Response(JSON.stringify({ files }), {
      headers: {
        'Content-Type':                'application/json',
        'Cache-Control':               'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (err) {
    console.error('[registry list]', err);
    return new Response(
      JSON.stringify({ error: 'Failed to list bucket', files: [] }),
      {
        status: 500,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
};
