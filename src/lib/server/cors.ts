// src/lib/server/cors.ts
// Shared CORS helpers for endpoints called cross-origin from mms-accounts.

const ALLOWED_ORIGINS = [
  'https://mms-accounts.pages.dev',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow Cloudflare preview deployments: xxxxxxxx.mms-accounts.pages.dev
  if (/^https:\/\/[a-z0-9-]+\.mms-accounts\.pages\.dev$/.test(origin)) return true;
  return false;
}

export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin');
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age':       '86400',
    'Vary':                         'Origin',
  };
}

/** Handle OPTIONS preflight — return non-null Response to short-circuit. */
export function preflight(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  return null;
}

export function json(
  data: unknown,
  status: number,
  request: Request,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  });
    }
