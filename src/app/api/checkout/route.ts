import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { admin, price } from '@/lib/pricing';
const gh = z.string().transform(s => s.replace(/[\s-]/g, '')).pipe(z.string().regex(/^(\+233|0)\d{9}$/, 'Enter a valid Ghana phone number, e.g. 024 123 4567'));
const S = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80), email: z.string().trim().email('Enter a valid email, e.g. kwame@email.com').max(120),
  phone: gh, phone2: z.union([z.literal(''), gh]).optional(), method: z.enum(['delivery', 'pickup']),
  address: z.string().trim().max(200).optional(), city: z.string().trim().max(80).optional(), region: z.string().trim().max(80).optional(),
  pickup_date: z.string().optional(), pickup_location_id: z.string().uuid().optional().or(z.literal('')),
  payment: z.enum(['paystack', 'momo', 'whatsapp']), code: z.string().max(40).optional(), notes: z.string().max(300).optional(), hp: z.string().max(0).optional(),
  items: z.array(z.object({ id: z.string().uuid(), qty: z.number().int().min(1).max(20) })).min(1).max(30),
}).superRefine((d, c) => {
  if (d.method === 'delivery') { if (!d.address || d.address.length < 5) c.addIssue({ code: 'custom', path: ['address'], message: 'Enter your delivery address' }); if (!d.city) c.addIssue({ code: 'custom', path: ['city'], message: 'Enter your city or town' }); }
  else { const t = new Date(d.pickup_date ?? ''), today = new Date(); today.setHours(0, 0, 0, 0);
    if (isNaN(+t) || t < today || +t > +today + 14 * 864e5) c.addIssue({ code: 'custom', path: ['pickup_date'], message: 'Choose a pickup date within the next 14 days' });
    if (!d.pickup_location_id) c.addIssue({ code: 'custom', path: ['pickup_location_id'], message: 'Choose a pickup location' }); }
});
export async function POST(req: Request) {
  try {
    const b = S.parse(await req.json()), q = await price(b.items, b.code, b.method), db = admin();
    const sid = randomBytes(5).toString('hex').toUpperCase();
    const { error } = await db.from('orders').insert({ short_id: sid, name: b.name, email: b.email, phone: b.phone, phone2: b.phone2 || null, method: b.method,
      address: b.method === 'delivery' ? b.address : null, city: b.method === 'delivery' ? b.city : null, region: b.region || null,
      pickup_date: b.method === 'pickup' ? b.pickup_date : null, pickup_location_id: b.method === 'pickup' ? b.pickup_location_id : null,
      items: q.lines.map(l => ({ id: l.id, name: l.name, price: l.price, qty: l.qty })), subtotal: q.sub, discount_total: q.discount, delivery_fee: q.fee, total: q.total, payment: b.payment, notes: b.notes || null });
    if (error) throw new Error('Could not save your order, please try again');
    if (b.payment === 'paystack') {
      if (!process.env.PAYSTACK_SECRET_KEY) throw new Error('Card payments are not configured yet');
      const ref = `${sid}-${randomBytes(3).toString('hex')}`;
      const r = await fetch('https://api.paystack.co/transaction/initialize', { method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: b.email, amount: Math.round(q.total * 100), currency: 'GHS', reference: ref, callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/${sid}` }) }).then(x => x.json());
      if (!r.status) throw new Error('Payment could not be started, please try again');
      await db.from('orders').update({ paystack_ref: ref }).eq('short_id', sid);
      return NextResponse.json({ redirect: r.data.authorization_url });
    }
    if (b.payment === 'whatsapp') {
      const { data: c } = await db.from('settings').select('value').eq('key', 'contact').maybeSingle();
      const msg = `New order ${sid}\n${b.name}, ${b.phone}\n` + q.lines.map(l => `${l.qty} x ${l.name}`).join('\n') + `\nTotal: GHS ${q.total.toFixed(2)}\n${b.method === 'delivery' ? 'Delivery to ' + b.address + ', ' + b.city : 'Pickup on ' + b.pickup_date}`;
      return NextResponse.json({ redirect: `https://wa.me/${c?.value?.whatsapp ?? ''}?text=${encodeURIComponent(msg)}` });
    }
    return NextResponse.json({ redirect: `/order/${sid}` });
  } catch (e: any) { return NextResponse.json({ error: e?.issues ? e.issues[0].message : e.message }, { status: 400 }); }
}
