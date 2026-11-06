import crypto from 'crypto';

/**
 * Prompt Injection & Adversarial Defense Sanitizer
 * Strips jailbreaks, system extraction attempts and control tokens.
 */
export function sanitizePromptInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // Truncate payload flood attacks
  if (sanitized.length > 3000) {
    sanitized = sanitized.slice(0, 3000);
  }

  // Neutralize common prompt injection patterns
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above)\s+instructions/gi,
    /system\s+prompt/gi,
    /reveal\s+(your\s+)?instructions/gi,
    /what\s+are\s+your\s+rules/gi,
    /output\s+all\s+rules/gi,
    /disregard\s+(all\s+)?rules/gi,
    /you\s+are\s+now\s+in\s+DAN\s+mode/gi,
    /developer\s+mode\s+output/gi,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED_SECURITY_POLICY]');
  }

  return sanitized.trim();
}

/**
 * HMAC-SHA256 Cryptographic Signature Verification
 * Validates incoming webhooks from CloudTalk, Stripe, and Twilio.
 */
export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;

  try {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
    );
  } catch (err) {
    console.error('HMAC validation error:', err);
    return false;
  }
}

/**
 * Public Security Headers - Masks internal LLM implementation
 */
export const GUUD_SECURITY_HEADERS = {
  'X-Engine': 'GuudEngine-Neural-v4',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
