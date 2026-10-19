import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { admin } from '@/lib/pricing';
export const dynamic = 'force-dynamic';
export default async function Order({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params, db = admin();
  const { data: o } = await db.from('orders').select('short_id,total,payment,status').eq('short_id', id.toUpperCase().slice(0, 12)).maybeSingle();
  const { data: p } = await db.from('settings').select('value').eq('key', 'payments').maybeSingle();
  return (<div className="wrap ordr"><CheckCircle size={72} color="var(--primary)" /><h1 className="h2">{o ? 'Order received' : 'Order not found'}</h1>
    {o && <><p>Your order number is <b>{o.short_id}</b>. Total GH₵{Number(o.total).toFixed(2)}.</p>
      {o.payment === 'momo' && <p className="momo">Send the total by Mobile Money to <b>{p?.value?.momo_number || 'the number we will confirm'}</b> {p?.value?.momo_name && `(${p.value.momo_name})`} and use <b>{o.short_id}</b> as the reference. We confirm your order once payment arrives.</p>}
      {o.payment === 'paystack' && <p>We confirm your order as soon as the card payment clears.</p>}</>}
    <Link href="/shop" className="btn">Continue shopping</Link></div>);
}
