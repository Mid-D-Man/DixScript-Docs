// src/lib/routes/api/registry/reject/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';

interface RegistrySubmission {
  id:                    string;
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

  // ── Parse body ─────────────────────────────────────────────
  let submissionId: string;
  let note: string;
  try {
    const body = await request.json() as { submission_id?: string; note?: string };
    submissionId = body.submission_id?.trim() ?? '';
    note         = body.note?.trim() ?? '';
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

  // ── Fetch submission ───────────────────────────────────────
  const subRes = await fetch(
    `${supabaseUrl}/rest/v1/registry_submissions?id=eq.${encodeURIComponent(submissionId)}&select=id,status,supabase_storage_path&limit=1`,
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

  // ── Delete file from Supabase Storage ──────────────────────
  if (sub.supabase_storage_path) {
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
      console.warn('[reject] Failed to delete file from Supabase Storage');
    }
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
        status:      'rejected',
        admin_note:  note || null,
        reviewed_at: new Date().toISOString(),
      }),
    },
  );

  if (!updateRes.ok) {
    const text = await updateRes.text();
    return new Response(JSON.stringify({ ok: false, error: `Failed to update submission: ${text}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
