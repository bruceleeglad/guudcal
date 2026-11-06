import { NextResponse } from 'next/server';
import { validateLicense } from '@/lib/licensing';
import { GUUD_SECURITY_HEADERS } from '@/lib/security';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const licenseKey = searchParams.get('key') || 'DEMO';
  const referer = req.headers.get('referer') || '';
  const origin = req.headers.get('origin') || referer;

  // Verify license against calling domain
  const validation = validateLicense(licenseKey, origin);

  const jsScript = `
(function() {
  'use strict';
  
  const LICENSE_KEY = "${licenseKey}";
  const IS_AUTHORIZED = ${validation.valid};
  const ERROR_MSG = "${validation.message.replace(/"/g, '\\"')}";

  if (!IS_AUTHORIZED) {
    console.error("[GuudCal Licensing Error]:", ERROR_MSG);
    const warning = document.createElement('div');
    warning.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ef4444;color:#fff;padding:12px 18px;border-radius:8px;font-family:sans-serif;font-size:12px;z-index:999999;box-shadow:0 10px 25px rgba(0,0,0,0.3);';
    warning.innerHTML = '<strong>GuudCal Licensfejl:</strong> ' + ERROR_MSG;
    document.body.appendChild(warning);
    return;
  }

  // Inject GuudCal Widget Container
  window.GuudCal = {
    key: LICENSE_KEY,
    open: function(options) {
      const modal = document.createElement('div');
      modal.id = 'guudcal-modal-overlay';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';
      
      modal.innerHTML = \`
        <div style="position:relative;width:100%;max-width:680px;height:85vh;max-height:760px;background:#09090b;border:1px solid #27272a;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <button onclick="document.getElementById('guudcal-modal-overlay').remove()" style="position:absolute;top:12px;right:16px;background:#27272a;border:none;color:#a1a1aa;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:sans-serif;font-size:12px;z-index:10;">✕ Luk</button>
          <iframe src="https://cal.guud.pro?embed=true&license=\${LICENSE_KEY}" style="width:100%;height:100%;border:none;" allow="camera; microphone; autoplay"></iframe>
        </div>
      \`;
      document.body.appendChild(modal);
    }
  };

  console.log("[GuudCal Engine]: Widget ready and securely initialized with license " + LICENSE_KEY);
})();
`;

  return new NextResponse(jsScript, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...GUUD_SECURITY_HEADERS,
    },
  });
}
