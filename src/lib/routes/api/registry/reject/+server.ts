// src/lib/routes/api/registry/reject/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { verifyAdminJwt } from '$lib/server/auth';
import { preflight, json } from '$lib/server/cors';

interface RegistrySubmission {
  id:                    string;
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

  let submissionId: string;
  let note: string;
  try {
    const body = await request.json() as { submission_id?: string; note?: string };
    submissionId = body.submission_id?.trim() ?? '';
    note         = body.note?.trim() ?? '';
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400, request);
  }

  if (!submissionId) {
    return json({ ok: false, error: 'submission_id is required.' }, 400, request);
  }

  // Fetch submission
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

  // Delete file from Supabase Storage
  if (sub.supabase_storage_path) {
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
      console.warn('[reject] Failed to delete file from Supabase Storage');
    }
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
        status:      'rejected',
        admin_note:  note || null,
        reviewed_at: new Date().toISOString(),
      }),
    },
  );

  if (!updateRes.ok) {
    const text = await updateRes.text();
    return json({ ok: false, error: `Failed to update submission: ${text}` }, 500, request);
  }

  return json({ ok: true }, 200, request);
};
