import { sb } from './supabase';
export const money = (n: number, cur = 'GH₵') => `${cur}${Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export async function getProducts(opts: { limit?: number; featured?: boolean } = {}) {
  try { let q = sb().from('products').select('*, categories(name,slug)').eq('active', true).order('created_at', { ascending: false });
    if (opts.featured) q = q.eq('featured', true); if (opts.limit) q = q.limit(opts.limit);
    const { data } = await q; return data ?? []; } catch { return []; }
}
