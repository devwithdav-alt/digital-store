import { NextRequest, NextResponse } from 'next/server';
const hits = new Map<string,{n:number,t:number}>();
const LIMITS: Record<string,number> = { '/api/checkout':8, '/api/contact':5, '/api/discount':20 };
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const limit = Object.entries(LIMITS).find(([k]) => p.startsWith(k))?.[1];
  if (limit) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
    const key = ip + p, now = Date.now(), h = hits.get(key);
    if (!h || now - h.t > 60_000) hits.set(key, { n: 1, t: now });
    else if (++h.n > limit) return new NextResponse('Too many requests', { status: 429 });
    if (req.method !== 'GET') {
      const o = req.headers.get('origin');
      if (o && new URL(o).host !== req.nextUrl.host) return new NextResponse('Forbidden', { status: 403 });
    }
  }
  const res = NextResponse.next();
  const dev = process.env.NODE_ENV !== 'production';
  res.headers.set('Content-Security-Policy', [
    "default-src 'self'", `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''} https://js.paystack.co`,
    "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self' data:", "connect-src 'self' https://*.supabase.co https://api.paystack.co",
    'frame-src https://checkout.paystack.com https://www.google.com', "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'"
  ].join('; '));
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
