import { NextResponse } from 'next/server';
import { LICENSE_REGISTRY, validateLicense, addDomainToLicense } from '@/lib/licensing';
import { GUUD_SECURITY_HEADERS } from '@/lib/security';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const all = searchParams.get('all');

  if (all === 'true') {
    const adminToken = req.headers.get('x-admin-token');
    const secretAdminKey = process.env.ADMIN_SECRET_KEY || 'guud-admin-supersecret-2026';
    if (adminToken !== secretAdminKey) {
      return NextResponse.json(
        { success: false, error: 'Uautoriseret adgang til samlet licensregister' },
        { status: 401, headers: GUUD_SECURITY_HEADERS }
      );
    }
    return NextResponse.json(
      { success: true, licenses: Object.values(LICENSE_REGISTRY) },
      { headers: GUUD_SECURITY_HEADERS }
    );
  }

  if (!key) {
    return NextResponse.json(
      { success: false, error: 'Mangler parameter: ?key=<licensnøgle>' },
      { status: 400, headers: GUUD_SECURITY_HEADERS }
    );
  }

  const license = LICENSE_REGISTRY[key.trim().toUpperCase()];

  if (!license) {
    return NextResponse.json(
      { success: false, error: 'Licensnøgle ikke fundet' },
      { status: 404, headers: GUUD_SECURITY_HEADERS }
    );
  }

  return NextResponse.json(
    { success: true, license },
    { headers: GUUD_SECURITY_HEADERS }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, domain, action } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Mangler licensnøgle (key)' },
        { status: 400, headers: GUUD_SECURITY_HEADERS }
      );
    }

    if (action === 'validate') {
      const validation = validateLicense(key, domain);
      return NextResponse.json(
        { success: validation.valid, validation },
        { headers: GUUD_SECURITY_HEADERS }
      );
    }

    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Mangler domænenavn' },
        { status: 400, headers: GUUD_SECURITY_HEADERS }
      );
    }

    const result = addDomainToLicense(key, domain);
    return NextResponse.json(
      result,
      { status: result.success ? 200 : 403, headers: GUUD_SECURITY_HEADERS }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverfejl under licenshåndtering';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: GUUD_SECURITY_HEADERS }
    );
  }
}
