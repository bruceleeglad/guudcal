export type LicenseTier = 'solo' | 'agency' | 'lifetime';

export interface CustomerLicense {
  key: string;
  company: string;
  tier: LicenseTier;
  maxDomains: number;
  registeredDomains: string[];
  monthlyLeadsQuota: number;
  leadsUsedThisMonth: number;
  status: 'active' | 'suspended' | 'expired';
  expiresAt: string;
}

// In-memory persistent registry (can be mapped to PostgreSQL / SQLite)
export const LICENSE_REGISTRY: Record<string, CustomerLicense> = {
  'GC-SOLO-9823': {
    key: 'GC-SOLO-9823',
    company: 'Nordic Scale Media',
    tier: 'solo',
    maxDomains: 1,
    registeredDomains: ['nordicscale.dk', 'localhost:3008'],
    monthlyLeadsQuota: 250,
    leadsUsedThisMonth: 42,
    status: 'active',
    expiresAt: '2027-11-03',
  },
  'GC-AGENCY-4819': {
    key: 'GC-AGENCY-4819',
    company: 'København Web Bureau',
    tier: 'agency',
    maxDomains: 10,
    registeredDomains: ['kbhweb.dk', 'kbh-lead.dk', 'localhost:3008'],
    monthlyLeadsQuota: 1000,
    leadsUsedThisMonth: 184,
    status: 'active',
    expiresAt: '2027-11-03',
  },
  'GC-LIFE-7721': {
    key: 'GC-LIFE-7721',
    company: 'Bruce Ventures Master',
    tier: 'lifetime',
    maxDomains: 10,
    registeredDomains: ['guud.pro', 'cal.guud.pro', 'localhost:3008', '127.0.0.1:3008'],
    monthlyLeadsQuota: 999999,
    leadsUsedThisMonth: 312,
    status: 'active',
    expiresAt: 'LIFETIME (Evig)',
  },
};

export interface LicenseValidationResult {
  valid: boolean;
  code: 'OK' | 'INVALID_KEY' | 'DOMAIN_LIMIT_REACHED' | 'UNAUTHORIZED_DOMAIN' | 'QUOTA_EXCEEDED' | 'EXPIRED';
  message: string;
  license?: CustomerLicense;
}

/**
 * Validates whether a request from an origin/domain is authorized under the given license key
 */
export function validateLicense(key: string, requestOrigin?: string): LicenseValidationResult {
  const cleanKey = (key || '').trim().toUpperCase();
  const license = LICENSE_REGISTRY[cleanKey];

  if (!license) {
    return {
      valid: false,
      code: 'INVALID_KEY',
      message: 'Ugyldig eller ikke-eksisterende licensnøgle.',
    };
  }

  if (license.status !== 'active') {
    return {
      valid: false,
      code: 'EXPIRED',
      message: `Licensen er suspenderet eller udløbet (${license.status}).`,
      license,
    };
  }

  // Domain whitelist validation
  if (requestOrigin) {
    let host = requestOrigin.replace(/^https?:\/\//, '').split('/')[0].split(':')[0].toLowerCase();
    
    // Normalize localhost / staging
    const isRegistered = license.registeredDomains.some(d => {
      const cleanD = d.replace(/^https?:\/\//, '').split('/')[0].split(':')[0].toLowerCase();
      return cleanD === host;
    });

    if (!isRegistered) {
      if (license.registeredDomains.length >= license.maxDomains) {
        return {
          valid: false,
          code: 'DOMAIN_LIMIT_REACHED',
          message: `Domænegrænse nået for ${license.tier.toUpperCase()} licens (${license.registeredDomains.length}/${license.maxDomains} domæner brugt). Opgrader til Agency Pro for op til 10 domæner.`,
          license,
        };
      }
    }
  }

  // Quota check
  if (license.tier !== 'lifetime' && license.leadsUsedThisMonth >= license.monthlyLeadsQuota) {
    return {
      valid: false,
      code: 'QUOTA_EXCEEDED',
      message: `Månedlig lead-kvote nået (${license.leadsUsedThisMonth}/${license.monthlyLeadsQuota}). Overage afregnes til 0,25 kr./lead.`,
      license,
    };
  }

  return {
    valid: true,
    code: 'OK',
    message: 'Licens godkendt og aktiv.',
    license,
  };
}

/**
 * Adds a new domain to a customer's active license
 */
export function addDomainToLicense(key: string, domain: string): { success: boolean; message: string; license?: CustomerLicense } {
  const cleanKey = (key || '').trim().toUpperCase();
  const license = LICENSE_REGISTRY[cleanKey];

  if (!license) {
    return { success: false, message: 'Licens ikke fundet.' };
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

  if (license.registeredDomains.includes(cleanDomain)) {
    return { success: true, message: 'Domænet er allerede registreret på denne licens.', license };
  }

  if (license.registeredDomains.length >= license.maxDomains) {
    return {
      success: false,
      message: `Kan ikke tilføje domæne. Grænsen på ${license.maxDomains} domæner er nået for ${license.tier.toUpperCase()} pakken.`,
      license,
    };
  }

  license.registeredDomains.push(cleanDomain);
  return { success: true, message: `Domæne '${cleanDomain}' registreret med succes!`, license };
}
