import type { RequestHandler } from '@sveltejs/kit';

interface ValidationResult {
  valid:    boolean;
  errors:   string[];
  warnings: string[];
}

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
               + `&select=id&limit=1`;

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

function validateMdixContent(content: string): ValidationResult {
  const errors:   string[] = [];
  const warnings: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('File content is empty.');
    return { valid: false, errors, warnings };
  }

  if (content.length > 512 * 1024) {
    errors.push('File size exceeds the 512 KB limit.');
  }

  const knownSections = [
    '@DATA', '@CONFIG', '@QUICKFUNCS', '@ENUMS',
    '@DLM',  '@IMPORTS', '@SECURITY',
  ];
  const upper = content.toUpperCase();
  if (!knownSections.some(s => upper.includes(s))) {
    errors.push(
      'File must contain at least one DixScript section ' +
      '(@DATA, @CONFIG, @QUICKFUNCS, @ENUMS, @DLM, @IMPORTS, or @SECURITY).'
    );
  }

  // Balanced parentheses check
  let depth = 0;
  let unbalanced = false;
  for (const char of content) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (depth < 0) { unbalanced = true; break; }
  }
  if (unbalanced || depth !== 0) {
    warnings.push('Potentially unbalanced parentheses detected. Check section syntax.');
  }

  // Warn on very short files
  if (content.trim().length < 20) {
    warnings.push('File content appears too short to be a complete package.');
  }

  return { valid: errors.length === 0, errors, warnings };
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const supabaseUrl    = platform?.env?.SUPABASE_URL;
  const serviceRoleKey = platform?.env?.SUPABASE_SERVICE_ROLE_KEY;

  const midId  = request.headers.get('X-MMS-MID-ID')  ?? '';
  const secret = request.headers.get('X-MMS-SECRET')   ?? '';

  if (!midId || !secret) {
    return new Response(
      JSON.stringify({ valid: false, errors: ['Missing X-MMS-MID-ID or X-MMS-SECRET headers.'], warnings: [] }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ valid: false, errors: ['Server misconfiguration — Supabase credentials not set.'], warnings: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const authed = await verifyMidAuth(midId, secret, supabaseUrl, serviceRoleKey);
  if (!authed) {
    return new Response(
      JSON.stringify({ valid: false, errors: ['Invalid MID ID or MID Secret.'], warnings: [] }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
    let content = '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (file instanceof File) {
        content = await file.text();
      } else if (typeof file === 'string') {
        content = file;
      }
    } else {
      content = await request.text();
    }

    const result = validateMdixContent(content);

    return new Response(JSON.stringify(result), {
      status: result.valid ? 200 : 422,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[registry validate]', err);
    return new Response(
      JSON.stringify({ valid: false, errors: ['Failed to process file.'], warnings: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
