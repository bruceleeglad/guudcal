import { NextResponse } from 'next/server';
import { GUUD_SECURITY_HEADERS } from '@/lib/security';

function isDisallowedHost(host: string): boolean {
  const cleanHost = host.toLowerCase().trim();
  if (
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost === '0.0.0.0' ||
    cleanHost === '::1' ||
    cleanHost.startsWith('127.') ||
    cleanHost.startsWith('10.') ||
    cleanHost.startsWith('192.168.') ||
    cleanHost.startsWith('169.254.') || // Cloud metadata & link-local
    cleanHost.endsWith('.internal') ||
    cleanHost.endsWith('.local')
  ) {
    return true;
  }
  // Check RFC1918 172.16.0.0/12
  const ipMatch = cleanHost.match(/^172\.(\d+)\./);
  if (ipMatch) {
    const secondOctet = parseInt(ipMatch[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400, headers: GUUD_SECURITY_HEADERS });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400, headers: GUUD_SECURITY_HEADERS });
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ success: false, error: 'Disallowed protocol' }, { status: 400, headers: GUUD_SECURITY_HEADERS });
    }

    if (isDisallowedHost(parsedUrl.hostname)) {
      return NextResponse.json({ success: false, error: 'Scanning internal addresses is forbidden' }, { status: 403, headers: GUUD_SECURITY_HEADERS });
    }

    const domain = parsedUrl.hostname.replace('www.', '');
    let title = domain.split('.')[0];
    title = title.charAt(0).toUpperCase() + title.slice(1);
    let primaryColor = '#1A1918';
    const accentColor = '#D97706';
    const theme = 'editorial';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].split(/[-–|•:]/)[0].trim();
        }

        // Extract theme-color meta
        const themeColorMatch = html.match(/<meta[^>]*name=["'](?:theme-color|msapplication-TileColor)["'][^>]*content=["']([^"']+)["']/i);
        if (themeColorMatch && themeColorMatch[1]) {
          primaryColor = themeColorMatch[1];
        } else {
          // Extract dominant hex color if found
          const hexMatches = html.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g);
          if (hexMatches && hexMatches.length > 0) {
            const candidates = hexMatches.filter(c => !['#000', '#000000', '#fff', '#ffffff', '#111', '#111111'].includes(c.toLowerCase()));
            if (candidates.length > 0) {
              primaryColor = candidates[0];
            }
          }
        }
      }
    } catch {
      // Deterministic palette based on domain name
      const colors = ['#0F766E', '#1E3A8A', '#B45309', '#15803D', '#7E22CE', '#BE123C'];
      const index = Math.abs(domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
      primaryColor = colors[index];
    }

    return NextResponse.json(
      {
        success: true,
        brand: {
          domain,
          name: title,
          primaryColor,
          accentColor,
          theme,
        },
      },
      { headers: GUUD_SECURITY_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, error: msg }, { status: 500, headers: GUUD_SECURITY_HEADERS });
  }
}
