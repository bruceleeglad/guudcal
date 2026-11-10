import { NextResponse } from 'next/server';
import { validateLicense } from '@/lib/licensing';
import { GUUD_EMBED_HEADERS } from '@/lib/security';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawKey = searchParams.get('key') || 'DEMO';
  const licenseKey = rawKey.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50);
  const referer = req.headers.get('referer') || '';
  const origin = req.headers.get('origin') || referer;

  // Verify license against calling domain
  const validation = validateLicense(licenseKey, origin);

  const jsScript = `
(function() {
  'use strict';
  
  const LICENSE_KEY = ${JSON.stringify(licenseKey)};
  const IS_AUTHORIZED = ${validation.valid ? 'true' : 'false'};
  const ERROR_MSG = ${JSON.stringify(validation.message)};

  if (!IS_AUTHORIZED) {
    console.error("[GuudCal Licensing Error]:", ERROR_MSG);
    const warning = document.createElement('div');
    warning.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ef4444;color:#fff;padding:12px 18px;border-radius:8px;font-family:sans-serif;font-size:12px;z-index:999999;box-shadow:0 10px 25px rgba(0,0,0,0.3);';
    const strong = document.createElement('strong');
    strong.textContent = 'GuudCal Licensfejl: ';
    const msg = document.createElement('span');
    msg.textContent = ERROR_MSG;
    warning.appendChild(strong);
    warning.appendChild(msg);
    document.body.appendChild(warning);
    return;
  }

  // Inject GuudCal Widget Container
  window.GuudCal = {
    key: LICENSE_KEY,
    open: function() {
      const modal = document.createElement('div');
      modal.id = 'guudcal-modal-overlay';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';
      
      const container = document.createElement('div');
      container.style.cssText = 'position:relative;width:100%;max-width:680px;height:85vh;max-height:760px;background:#09090b;border:1px solid #27272a;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Luk';
      closeBtn.style.cssText = 'position:absolute;top:12px;right:16px;background:#27272a;border:none;color:#a1a1aa;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:sans-serif;font-size:12px;z-index:10;';
      closeBtn.onclick = function() {
        const ov = document.getElementById('guudcal-modal-overlay');
        if (ov) ov.remove();
      };

      const iframe = document.createElement('iframe');
      iframe.src = 'https://guudcal.vercel.app?embed=true&license=' + encodeURIComponent(LICENSE_KEY);
      iframe.style.cssText = 'width:100%;height:100%;border:none;';
      iframe.setAttribute('allow', 'camera; microphone; autoplay');

      container.appendChild(closeBtn);
      container.appendChild(iframe);
      modal.appendChild(container);
      document.body.appendChild(modal);
    }
  };

  console.log("[GuudCal Engine]: Widget ready and securely initialized.");
})();
`;

  return new NextResponse(jsScript, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...GUUD_EMBED_HEADERS,
    },
  });
}
