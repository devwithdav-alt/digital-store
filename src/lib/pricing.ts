import { createClient } from '@supabase/supabase-js';
export const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const r2 = (n: number) => Math.round(n * 100) / 100;
export async function price(raw: { id: string; qty: number }[], code: string | undefined, method: 'delivery' | 'pickup') {
  const db = admin(), { data: prods } = await db.from('products').select('id,name,price,stock,active,bundle_eligible').in('id', raw.map(x => x.id));
  const lines = raw.map(x => { const p = prods?.find(q => q.id === x.id); if (!p || !p.active) throw new Error('An item in your cart is no longer available');
    const qty = Math.min(Math.max(1, Math.floor(x.qty)), 20); if (p.stock < qty) throw new Error(`${p.name} has only ${p.stock} left`);
    return { id: p.id, name: p.name, price: Number(p.price), qty, bundle: p.bundle_eligible }; });
  const sub = r2(lines.reduce((a, l) => a + l.price * l.qty, 0)), now = new Date().toISOString();
  const [{ data: ds }, { data: st }] = await Promise.all([db.from('discounts').select('*').eq('active', true), db.from('settings').select('key,value').in('key', ['delivery', 'bundle'])]);
  const cfg = (k: string, d: any) => st?.find(x => x.key === k)?.value ?? d, dl = cfg('delivery', { free_over: 500, fee: 30 }), bd = cfg('bundle', { pct: 30, count: 3 });
  let discount = 0; const applied: string[] = [];
  for (const d of ds ?? []) {
    if ((d.starts_at && d.starts_at > now) || (d.ends_at && d.ends_at < now)) continue;
    if (d.code && d.code.toLowerCase() !== (code ?? '').trim().toLowerCase()) continue;
    let amt = 0;
    if (d.scope === 'cart') { if (sub >= Number(d.min_subtotal)) amt = d.kind === 'percent' ? sub * d.value / 100 : Number(d.value); }
    else for (const l of lines) if ((!d.product_ids?.length || d.product_ids.includes(l.id)) && l.qty >= d.min_qty) amt += d.kind === 'percent' ? l.price * l.qty * d.value / 100 : Number(d.value) * l.qty;
    if (amt > 0) { discount += amt; applied.push(d.name || d.code); }
  }
  const units = lines.filter(l => l.bundle).flatMap(l => Array(l.qty).fill(l.price)).sort((a, b) => a - b), n = Math.floor(units.length / bd.count) * bd.count;
  if (n > 0) { discount += units.slice(0, n).reduce((a, b) => a + b, 0) * bd.pct / 100; applied.push(`Bundle saving ${bd.pct}%`); }
  discount = r2(Math.min(discount, sub));
  const fee = method === 'delivery' && sub - discount < dl.free_over ? Number(dl.fee) : 0;
  return { lines, sub, discount, fee, total: r2(sub - discount + fee), applied };
}
