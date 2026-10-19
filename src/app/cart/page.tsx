'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { readCart, CartItem } from '@/lib/cart';
export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]), [ready, setReady] = useState(false);
  useEffect(() => { setItems(readCart()); setReady(true); }, []);
  const save = (c: CartItem[]) => { setItems(c); localStorage.setItem('ds_cart', JSON.stringify(c)); window.dispatchEvent(new Event('cart')); };
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0), fmt = (n: number) => `GH₵${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
  return (<><section className="phead"><div className="wrap"><h1 className="display" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Your Cart</h1></div></section>
    <div className="wrap cartw">{!ready ? null : items.length === 0 ? <div className="empty ctr"><p>Your cart is empty.</p><Link href="/shop" className="btn" style={{ marginTop: 20 }}>Start shopping</Link></div> : <>
      <div className="clist">{items.map(i => <div className="crow" key={i.id + i.name}>
        <div className="cimg">{i.image ? <img src={i.image} alt="" /> : <Package size={36} color="var(--primary)" />}</div>
        <div><b>{i.name}</b><div>{fmt(i.price)}</div></div>
        <div className="qty"><button aria-label="Less" onClick={() => save(items.map(x => x === i ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}><Minus size={16} /></button><b>{i.qty}</b><button aria-label="More" onClick={() => save(items.map(x => x === i ? { ...x, qty: x.qty + 1 } : x))}><Plus size={16} /></button></div>
        <b>{fmt(i.price * i.qty)}</b>
        <button className="rm" aria-label="Remove" onClick={() => save(items.filter(x => x !== i))}><Trash2 size={18} /></button></div>)}</div>
      <aside className="sumbox"><h3>Order summary</h3><div className="srow"><span>Subtotal</span><b>{fmt(sub)}</b></div><p>Delivery and discounts are calculated at checkout.</p>
        <Link href="/checkout" className="btn" style={{ justifyContent: 'center' }}>Checkout</Link></aside></>}</div></>);
}
