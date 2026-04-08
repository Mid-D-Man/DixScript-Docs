// src/lib/routes/api/registry/approve/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';
import { preflight, json } from '$lib/server/cors';

interface RegistrySubmission {
  id:                    string;
  user_id:               string;
  mid_id:                string;
  filename:              string;
  category:              string;
  description:           string;
  tags:                  string[];
  version:               string;
  status:                string;
  supabase_storage_path: string | null;
}

export const OPTIONS: RequestHandler = async ({ request }) => {
  return preflight(request) ?? new Response(null, { status: 204 });
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const pre = preflight(request);
  if (pre) return pre;

  const auth = await verifyAdminJwt(request, platform);
  if (!auth.ok) {
    return json({ ok: false, error: auth.error }, 403, request);
  }

  const supabaseUrl    = platform?.env?.SUPABASE_URL!;
  const serviceRoleKey = platform?.env?.SUPABASE_SERVICE_ROLE_KEY!;
  const bucket         = platform?.env?.MDIX_REGISTRY;

  if (!bucket) {
    return json({ ok: false, error: 'R2 bucket not bound.' }, 500, request);
  }

  let submissionId: string;
  try {
    const body = await request.json() as { submission_id?: string };
    submissionId = body.submission_id?.trim() ?? '';
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400, request);
  }

  if (!submissionId) {
    return json({ ok: false, error: 'submission_id is required.' }, 400, request);
  }

  // Fetch submission row
  const subRes = await fetch(
    `${supabaseUrl}/rest/v1/registry_submissions?id=eq.${encodeURIComponent(submissionId)}&select=*&limit=1`,
    {
      headers: {
        apikey:        serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept:        'application/json',
      },
    },
  );

  if (!subRes.ok) {
    return json({ ok: false, error: 'Failed to fetch submission.' }, 500, request);
  }

  const rows = await subRes.json() as RegistrySubmission[];
  if (!rows.length) {
    return json({ ok: false, error: 'Submission not found.' }, 404, request);
  }

  const sub = rows[0];
  if (sub.status !== 'pending') {
    return json({ ok: false, error: `Submission is already ${sub.status}.` }, 409, request);
  }

  if (!sub.supabase_storage_path) {
    return json({ ok: false, error: 'No file path stored for this submission.' }, 422, request);
  }

  // Fetch file from Supabase Storage (R2 pending bucket)
  const storageRes = await fetch(
    `${supabaseUrl}/storage/v1/object/${sub.supabase_storage_path}`,
    {
      headers: {
        apikey:        serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!storageRes.ok) {
    return json({ ok: false, error: 'Failed to fetch file from storage.' }, 502, request);
  }

  const fileBytes = await storageRes.arrayBuffer();

  // Write to R2 packages/
  const r2Key   = `packages/${sub.category}/${sub.filename}`;
  const metaKey = r2Key.replace('.mdix', '.meta.json');

  await bucket.put(r2Key, fileBytes, {
    httpMetadata: { contentType: 'text/plain; charset=utf-8' },
  });

  const meta = {
    desc:     sub.description,
    tags:     Array.isArray(sub.tags) ? sub.tags : [],
    category: sub.category,
    addedBy:  sub.mid_id,
    version:  sub.version,
  };

  await bucket.put(metaKey, JSON.stringify(meta, null, 2), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  });

  // Delete from Supabase Storage
  try {
    await fetch(
      `${supabaseUrl}/storage/v1/object/${sub.supabase_storage_path}`,
      {
        method:  'DELETE',
        headers: {
          apikey:        serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );
  } catch {
    console.warn('[approve] Failed to delete source file from Supabase Storage');
  }

  // Update submission status
  const updateRes = await fetch(
    `${supabaseUrl}/rest/v1/registry_submissions?id=eq.${encodeURIComponent(submissionId)}`,
    {
      method:  'PATCH',
      headers: {
        apikey:         serviceRoleKey,
        Authorization:  `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({
        status:      'approved',
        r2_key:      r2Key,
        reviewed_at: new Date().toISOString(),
      }),
    },
  );

  if (!updateRes.ok) {
    console.error('[approve] Failed to update submission status:', await updateRes.text());
  }

  return json({ ok: true, r2_key: r2Key }, 200, request);
};
