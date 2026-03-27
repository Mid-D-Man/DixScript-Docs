import type { RequestHandler } from '@sveltejs/kit';

interface PackageMeta {
  desc:     string;
  tags:     string[];
  category: string;
  addedBy:  string;
  version:  string;
}

const DEFAULT_META: PackageMeta = {
  desc:     'Importable .mdix package.',
  tags:     ['shared'],
  category: 'utils',
  addedBy:  'MidManStudio',
  version:  '1.0.0',
};

export const GET: RequestHandler = async ({ platform }) => {
  const bucket = platform?.env?.MDIX_REGISTRY;

  if (!bucket) {
    return new Response(
      JSON.stringify({ error: 'R2 bucket not bound', files: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const listed = await bucket.list({ prefix: 'packages/' });

    // Separate .mdix from .meta.json
    const mdixObjects = listed.objects.filter(obj => obj.key.endsWith('.mdix'));

    // For each .mdix, attempt to load its sidecar .meta.json
    const files = await Promise.all(
      mdixObjects.map(async (obj) => {
        const metaKey  = obj.key.replace('.mdix', '.meta.json');
        let meta: PackageMeta = { ...DEFAULT_META };

        try {
          const metaObj = await bucket.get(metaKey);
          if (metaObj) {
            const raw = await metaObj.text();
            meta = { ...DEFAULT_META, ...JSON.parse(raw) };
          }
        } catch {
          // sidecar missing — use defaults
        }

        // e.g. "packages/game/base_types.mdix" → subpath = "game/base_types.mdix"
        const subpath  = obj.key.replace('packages/', '');
        const segments = subpath.split('/');
        const filename = segments[segments.length - 1];

        return {
          key:         obj.key,
          name:        filename,
          path:        subpath,
          size:        obj.size,
          uploaded:    obj.uploaded?.toISOString() ?? null,
          downloadUrl: `/api/registry/${subpath}`,
          ...meta,
        };
      })
    );

    return new Response(JSON.stringify({ files }), {
      headers: {
        'Content-Type':                'application/json',
        'Cache-Control':               'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[registry list]', err);
    return new Response(
      JSON.stringify({ error: 'Failed to list bucket', files: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
};
