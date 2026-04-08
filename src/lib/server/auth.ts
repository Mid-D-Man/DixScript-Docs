// src/lib/server/auth.ts

export interface AdminAuthResult {
  ok:      boolean;
  userId?: string;
  error?:  string;
}

export async function verifyAdminJwt(
  request:  Request,
  platform: App.Platform | undefined,
): Promise<AdminAuthResult> {
  const supabaseUrl    = platform?.env?.SUPABASE_URL;
  const anonKey        = platform?.env?.SUPABASE_ANON_KEY;
  const serviceRoleKey = platform?.env?.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return {
      ok:    false,
      error: 'Server misconfiguration — Supabase credentials not set. ' +
             `(url=${!!supabaseUrl} anon=${!!anonKey} service=${!!serviceRoleKey})`,
    };
  }

  const authHeader = request.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return { ok: false, error: 'Missing or malformed Authorization header.' };
  }

  const jwt = authHeader.slice(7).trim();
  if (!jwt) return { ok: false, error: 'Empty token.' };

  // Step 1 — verify JWT and extract user id
  let userId: string;
  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey:        anonKey,
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!userRes.ok) {
      return { ok: false, error: 'Invalid or expired session token.' };
    }

    const userData = await userRes.json() as { id?: string };
    if (!userData?.id) {
      return { ok: false, error: 'Could not resolve user from token.' };
    }
    userId = userData.id;
  } catch {
    return { ok: false, error: 'Failed to verify token with Supabase.' };
  }

  // Step 2 — check profile role via service_role key (bypasses RLS)
  try {
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role&limit=1`,
      {
        headers: {
          apikey:        serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Accept:        'application/json',
        },
      },
    );

    if (!profileRes.ok) {
      return { ok: false, error: 'Failed to fetch user profile.' };
    }

    const profiles = await profileRes.json() as Array<{ role: string }>;
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return { ok: false, error: 'Profile not found.' };
    }

    if (profiles[0].role !== 'admin') {
      return { ok: false, error: 'Insufficient permissions — admin role required.' };
    }

    return { ok: true, userId };
  } catch {
    return { ok: false, error: 'Failed to verify admin role.' };
  }
}
