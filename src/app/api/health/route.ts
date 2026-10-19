import { NextResponse } from 'next/server';
import { sb } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export async function GET() {
  const env = { url: !!process.env.NEXT_PUBLIC_SUPABASE_URL, anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, service: !!process.env.SUPABASE_SERVICE_ROLE_KEY, paystack: !!process.env.PAYSTACK_SECRET_KEY, site: !!process.env.NEXT_PUBLIC_SITE_URL };
  const { count, error } = await sb().from('products').select('*', { count: 'exact', head: true });
  return NextResponse.json({ env, products: error ? null : count, dbError: error?.message ?? null });
}
