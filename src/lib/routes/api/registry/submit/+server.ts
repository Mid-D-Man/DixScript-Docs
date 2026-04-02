import type { RequestHandler } from '@sveltejs/kit';

async function sha256Hex(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyMidAuth(
  midId:          string,
  secret:         string,
  supabaseUrl:    string,
  serviceRoleKey: string,
): Promise<boolean> {
  if (!midId || !secret || !supabaseUrl || !serviceRoleKey) return false;
  try {
    const hash = await sha256Hex(secret);
    const url  = `${supabaseUrl}/rest/v1/mid_secrets`
               + `?mid_id=eq.${encodeURIComponent(midId)}`
               + `&secret_hash=eq.${encodeURIComponent(hash)}`
               + `&is_active=eq.true`
               + `&select=id,user_id&limit=1`;

    const res = await fetch(url, {
      headers: {
        apikey:        serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept:        'application/json',
      },
    });
    if (!res.ok) return false;
    const rows = await res.json() as unknown[];
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

/** Basic structural check — returns null on pass, error string on fail */
function quickValidate(content: string, filename: string): string | null {
  if (!content || content.trim().length === 0) return 'File content is empty.';
  if (content.length > 512 * 1024) return 'File exceeds 512 KB limit.';
  if (!filename.endsWith('.mdix')) return 'File must have a .mdix extension.';

  const sections = ['@DATA', '@CONFIG', '@QUICKFUNCS', '@ENUMS', '@DLM', '@IMPORTS', '@SECURITY'];
  if (!sections.some(s => content.toUpperCase().includes(s))) {
    return 'File must contain at least one DixScript section (@DATA, @CONFIG, etc.).';
  }
  return null;
}

/** Create a pending registry_submissions row via Supabase REST */
async function createSubmissionRecord(
  supabaseUrl:    string,
  serviceRoleKey: string,
  payload: {
    user_id:               string;
    mid_id:                string;
    filename:              string;
    category:              string;
    description:           string;
    tags:                  string[];
    version:               string;
    supabase_storage_path: string;
  }
): Promise<{ id: string } | null> {
  const body = {
    ...payload,
    status: 'pending',
    tags:   payload.tags,
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/registry_submissions`, {
    method: 'POST',
    headers: {
      apikey:        serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer:        'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('[submit] DB insert failed:', await res.text());
    return null;
  }
  const rows = await res.json() as Array<{ id: string }>;
  return rows[0] ?? null;
}

/** Resolve user_id from mid_id using service role (needed for DB record) */
async function getUserIdFromMidId(
  midId:          string,
  supabaseUrl:    string,
  serviceRoleKey: string,
): Promise<string | null> {
  try {
    const url = `${supabaseUrl}/rest/v1/profiles?mid_id=eq.${encodeURIComponent(midId)}&select=id&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey:        serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept:        'application/json',
      },
    });
    if (!res.ok) return null;
    const rows = await res.json() as Array<{ id: string }>;
    return rows[0]?.id ?? null;
  } catch {
    return null;
  }
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const supabaseUrl    = platform?.env?.SUPABASE_URL;
  const serviceRoleKey = platform?.env?.SUPABASE_SERVICE_ROLE_KEY;
  const bucket         = platform?.env?.MDIX_REGISTRY;

  // ── Auth ───────────────────────────────────────────────────
  const midId  = request.headers.get('X-MMS-MID-ID')  ?? '';
  const secret = request.headers.get('X-MMS-SECRET')   ?? '';

  if (!midId || !secret) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Missing X-MMS-MID-ID or X-MMS-SECRET headers.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Server misconfiguration.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!bucket) {
    return new Response(
      JSON.stringify({ ok: false, error: 'R2 bucket not bound.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const authed = await verifyMidAuth(midId, secret, supabaseUrl, serviceRoleKey);
  if (!authed) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid MID ID or MID Secret.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Parse form data ────────────────────────────────────────
  try {
    const form = await request.formData();

    const fileField   = form.get('file');
    const name        = (form.get('name')        as string ?? '').trim();
    const category    = (form.get('category')    as string ?? 'script').trim();
    const version     = (form.get('version')     as string ?? '1.0.0').trim();
    const description = (form.get('description') as string ?? '').trim();
    const tagsRaw     = (form.get('tags')        as string ?? '');

    let content  = '';
    let filename = name;

    if (fileField instanceof File) {
      content  = await fileField.text();
      filename = fileField.name || name;
    } else if (typeof fileField === 'string') {
      content = fileField;
    }

    // Ensure .mdix extension
    if (!filename.endsWith('.mdix')) filename = `${filename}.mdix`;

    // ── Validate ─────────────────────────────────────────────
    const validationError = quickValidate(content, filename);
    if (validationError) {
      return new Response(
        JSON.stringify({ ok: false, error: validationError }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!description) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Description is required.' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tags = tagsRaw
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // ── Resolve user_id ───────────────────────────────────────
    const userId = await getUserIdFromMidId(midId, supabaseUrl, serviceRoleKey);
    if (!userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Could not resolve account from MID ID.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Upload to R2 registry-pending ─────────────────────────
    const timestamp   = Date.now();
    const r2Key       = `registry-pending/${midId}/${timestamp}_${filename}`;
    const fileBytes   = new TextEncoder().encode(content);

    await bucket.put(r2Key, fileBytes, {
      httpMetadata: { contentType: 'text/plain; charset=utf-8' },
    });

    // ── Create submission record in Supabase ──────────────────
    const record = await createSubmissionRecord(supabaseUrl, serviceRoleKey, {
      user_id:               userId,
      mid_id:                midId,
      filename,
      category,
      description,
      tags,
      version,
      supabase_storage_path: r2Key,
    });

    if (!record) {
      // R2 upload succeeded but DB insert failed — clean up
      try { await bucket.delete(r2Key); } catch { /* best effort */ }
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to record submission. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, submission_id: record.id, path: r2Key }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[registry submit]', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
