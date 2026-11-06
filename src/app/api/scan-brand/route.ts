import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    let domain = '';
    try {
      domain = new URL(targetUrl).hostname.replace('www.', '');
    } catch {
      domain = targetUrl;
    }

    let title = domain.split('.')[0];
    title = title.charAt(0).toUpperCase() + title.slice(1);
    let primaryColor = '#1A1918';
    let accentColor = '#D97706';
    let theme = 'editorial';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(targetUrl, {
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
            // Pick a non-black, non-white distinctive color
            const candidates = hexMatches.filter(c => !['#000', '#000000', '#fff', '#ffffff', '#111', '#111111'].includes(c.toLowerCase()));
            if (candidates.length > 0) {
              primaryColor = candidates[0];
            }
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Direct fetch failed, generating harmonic brand palette for domain:', domain);
      // Deterministic palette based on domain name
      const colors = ['#0F766E', '#1E3A8A', '#B45309', '#15803D', '#7E22CE', '#BE123C'];
      const index = Math.abs(domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
      primaryColor = colors[index];
    }

    return NextResponse.json({
      success: true,
      brand: {
        domain,
        name: title,
        primaryColor,
        accentColor,
        theme,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
