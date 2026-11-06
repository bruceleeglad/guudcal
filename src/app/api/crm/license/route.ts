import { NextResponse } from 'next/server';
import { LICENSE_REGISTRY, validateLicense, addDomainToLicense } from '@/lib/licensing';
import { GUUD_SECURITY_HEADERS } from '@/lib/security';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const all = searchParams.get('all');

  if (all === 'true') {
    return NextResponse.json(
      { success: true, licenses: Object.values(LICENSE_REGISTRY) },
      { headers: GUUD_SECURITY_HEADERS }
    );
  }

  const licenseKey = key || 'GC-AGENCY-4819';
  const license = LICENSE_REGISTRY[licenseKey.toUpperCase()];

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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Serverfejl under licenshåndtering' },
      { status: 500, headers: GUUD_SECURITY_HEADERS }
    );
  }
}
