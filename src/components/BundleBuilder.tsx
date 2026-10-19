'use client';
import { useState } from 'react';
import { Package, Check, X } from 'lucide-react';
import { addToCart } from '@/lib/cart';
type P = { id: string; name: string; price: number; image: string | null; slug: string; cat: string };
export default function BundleBuilder({ products, count, pct, cur }: { products: P[]; count: number; pct: number; cur: string }) {
  const [sel, setSel] = useState<string[]>([]);
  const f = (n: number) => `${cur}${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const chosen = sel.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const total = chosen.reduce((a, p) => a + p.price, 0), full = chosen.length === count, after = full ? total * (1 - pct / 100) : total;
  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : s.length < count ? [...s, id] : s);
  return (<div className="bund"><div className="grid g3 tight">{products.map(p => <button key={p.id} className={'bcard' + (sel.includes(p.id) ? ' on' : '')} onClick={() => toggle(p.id)} aria-pressed={sel.includes(p.id)}>
      <span className="bimg">{p.image ? <img src={p.image} alt="" /> : <Package size={56} strokeWidth={1.2} color="var(--primary)" />}{sel.includes(p.id) && <i><Check size={16} /></i>}</span>
      <small>{p.cat}</small><b>{p.name}</b><span>{f(p.price)}</span></button>)}</div>
    <aside className="bpanel"><h3>Your bundle</h3><p>Pick {count} products and save {pct}%</p>
      <ul>{chosen.map(p => <li key={p.id}><span>{p.name}</span><b>{f(p.price)}</b><button aria-label="Remove" onClick={() => toggle(p.id)}><X size={16} /></button></li>)}</ul>
      <div className="btot"><span>Total</span><b>{f(after)}</b></div>{full && <small>You save {f(total - after)}</small>}
      <button className="btn" disabled={!full} onClick={() => { chosen.forEach(p => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image ?? undefined })); setSel([]); }}>{full ? 'Add bundle to cart' : `Select ${count - chosen.length} more`}</button></aside></div>);
}
