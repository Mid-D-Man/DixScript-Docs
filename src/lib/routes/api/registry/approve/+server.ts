// src/lib/routes/api/registry/approve/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';

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

export const POST: RequestHandler = async ({ request, platform }) => {
  // ── Auth ──────────────────────────────────────────────────
  const auth = await verifyAdminJwt(request, platform);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl    = platform?.env?.SUPABASE_URL!;
  const serviceRoleKey = platform?.env?.SUPABASE_SERVICE_ROLE_KEY!;
  const bucket         = platform?.env?.MDIX_REGISTRY;

  if (!bucket) {
    return new Response(JSON.stringify({ ok: false, error: 'R2 bucket not bound.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Parse body ─────────────────────────────────────────────
  let submissionId: string;
  try {
    const body = await request.json() as { submission_id?: string };
    submissionId = body.submission_id?.trim() ?? '';
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!submissionId) {
    return new Response(JSON.stringify({ ok: false, error: 'submission_id is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Fetch submission row ────────────────────────────────────
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
    return new Response(JSON.stringify({ ok: false, error: 'Failed to fetch submission.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rows = await subRes.json() as RegistrySubmission[];
  if (!rows.length) {
    return new Response(JSON.stringify({ ok: false, error: 'Submission not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sub = rows[0];
  if (sub.status !== 'pending') {
    return new Response(JSON.stringify({ ok: false, error: `Submission is already ${sub.status}.` }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!sub.supabase_storage_path) {
    return new Response(JSON.stringify({ ok: false, error: 'No file path stored for this submission.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Fetch file from Supabase Storage ───────────────────────
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
    return new Response(JSON.stringify({ ok: false, error: 'Failed to fetch file from storage.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const fileBytes = await storageRes.arrayBuffer();

  // ── Write to R2 ────────────────────────────────────────────
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

  // ── Delete from Supabase Storage ───────────────────────────
  try {
    await fetch(
      `${supabaseUrl}/storage/v1/object/${sub.supabase_storage_path}`,
      {
        method: 'DELETE',
        headers: {
          apikey:        serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );
  } catch {
    // Non-fatal — file is already copied to R2
    console.warn('[approve] Failed to delete source file from Supabase Storage');
  }

  // ── Update submission status ────────────────────────────────
  const updateRes = await fetch(
    `${supabaseUrl}/rest/v1/registry_submissions?id=eq.${encodeURIComponent(submissionId)}`,
    {
      method: 'PATCH',
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
    // File is live in R2 — return success anyway
  }

  return new Response(JSON.stringify({ ok: true, r2_key: r2Key }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
