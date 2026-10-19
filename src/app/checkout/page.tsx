'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readCart, CartItem } from '@/lib/cart';
import { sb } from '@/lib/supabase';
const fmt = (n: number) => `GH₵${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
export default function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]), [ready, setReady] = useState(false), [code, setCode] = useState(''), [applied, setApplied] = useState(''), [q, setQ] = useState<any>(null), [locs, setLocs] = useState<any[]>([]), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const [f, setF] = useState<any>({ name: '', email: '', phone: '', phone2: '', method: 'delivery', address: '', city: '', region: '', pickup_date: '', pickup_location_id: '', payment: 'paystack', notes: '', hp: '' });
  const set = (k: string) => (e: any) => setF((s: any) => ({ ...s, [k]: e.target.value }));
  useEffect(() => { setItems(readCart()); setReady(true); sb().from('pickup_locations').select('*').eq('active', true).then(({ data }) => setLocs(data ?? [])); }, []);
  useEffect(() => { if (!items.length) return;
    fetch('/api/discount', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map(i => ({ id: i.id, qty: i.qty })), code: applied, method: f.method }) }).then(r => r.json()).then(setQ).catch(() => {}); }, [items, applied, f.method]);
  const day = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  async function submit(e: React.FormEvent) { e.preventDefault(); setErr(''); setBusy(true);
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, code: applied, items: items.map(i => ({ id: i.id, qty: i.qty })) }) });
    const d = await r.json(); if (r.ok && d.redirect) { localStorage.removeItem('ds_cart'); window.dispatchEvent(new Event('cart')); window.location.assign(d.redirect); } else { setErr(d.error ?? 'Something went wrong'); setBusy(false); } }
  if (ready && !items.length) return <div className="wrap ordr"><h1 className="h2">Your cart is empty</h1><Link href="/shop" className="btn">Start shopping</Link></div>;
  const d = f.method === 'delivery';
  return (<div className="wrap cko"><form onSubmit={submit}>
    <h2>Contact</h2>
    <input required placeholder="Full name, e.g. Kwame Mensah" value={f.name} onChange={set('name')} autoComplete="name" maxLength={80} />
    <input required type="email" placeholder="Email, e.g. kwame@email.com" value={f.email} onChange={set('email')} autoComplete="email" />
    <div className="two"><input required type="tel" inputMode="tel" placeholder="Phone, e.g. 024 123 4567" value={f.phone} onChange={set('phone')} pattern="(\+233|0)[0-9 \-]{9,13}" title="e.g. 024 123 4567" />
      <input type="tel" inputMode="tel" placeholder="Second phone, optional" value={f.phone2} onChange={set('phone2')} pattern="((\+233|0)[0-9 \-]{9,13})?" /></div>
    <h2>Get your order</h2>
    <div className="seg"><button type="button" className={d ? 'on' : ''} onClick={() => setF({ ...f, method: 'delivery' })}>Delivery</button><button type="button" className={!d ? 'on' : ''} onClick={() => setF({ ...f, method: 'pickup' })}>Pickup</button></div>
    {d ? <><input required placeholder="Delivery address, e.g. House 12, Oxford Street, Osu" value={f.address} onChange={set('address')} autoComplete="street-address" />
      <div className="two"><input required placeholder="City or town, e.g. Accra" value={f.city} onChange={set('city')} /><input placeholder="Region, e.g. Greater Accra" value={f.region} onChange={set('region')} /></div></>
      : <><label className="lbl">Pickup date<input required type="date" min={day(0)} max={day(14)} value={f.pickup_date} onChange={set('pickup_date')} /></label>
        <label className="lbl">Store location<select required value={f.pickup_location_id} onChange={set('pickup_location_id')}><option value="">Choose a store</option>{locs.map(l => <option key={l.id} value={l.id}>{l.name}, {l.address}</option>)}</select></label></>}
    <textarea placeholder="Order notes, optional" maxLength={300} value={f.notes} onChange={set('notes')} rows={3} />
    <h2>Payment</h2>
    {[['paystack', 'Pay now with card or Mobile Money (Paystack)'], ['momo', 'Send Mobile Money directly'], ['whatsapp', 'Order on WhatsApp']].map(([v, l]) => <label key={v} className={'radio' + (f.payment === v ? ' on' : '')}><input type="radio" name="pay" checked={f.payment === v} onChange={() => setF({ ...f, payment: v })} />{l}</label>)}
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden value={f.hp} onChange={set('hp')} style={{ position: 'absolute', left: '-9999px' }} />
    {err && <p className="err" role="alert">{err}</p>}
    <button className="btn" disabled={busy} style={{ justifyContent: 'center', width: '100%' }}>{busy ? 'Please wait' : q ? `Place order, ${fmt(q.total ?? 0)}` : 'Place order'}</button></form>
    <aside className="sumbox"><h3>Order summary</h3>{items.map(i => <div className="srow sm" key={i.id + i.name}><span>{i.qty} x {i.name}</span></div>)}
      <div className="promo2"><input placeholder="Discount or promo code" value={code} onChange={e => setCode(e.target.value)} maxLength={40} /><button type="button" onClick={() => setApplied(code)}>Apply</button></div>
      {q?.error ? <p className="err">{q.error}</p> : q && <><div className="srow"><span>Subtotal</span><b>{fmt(q.sub)}</b></div>
        {q.discount > 0 && <div className="srow save"><span>{q.applied?.join(', ')}</span><b>-{fmt(q.discount)}</b></div>}
        <div className="srow"><span>Delivery</span><b>{d ? (q.fee ? fmt(q.fee) : 'Free') : 'Pickup'}</b></div>
        <div className="srow tot"><span>Total</span><b>{fmt(q.total)}</b></div></>}</aside></div>);
}
