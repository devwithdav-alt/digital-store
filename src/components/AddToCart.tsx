'use client';
import { ShoppingBag } from 'lucide-react';
import { addToCart } from '@/lib/cart';
export default function AddToCart({ p, label = true }: { p: any; label?: boolean }) {
  const out = p.stock <= 0;
  return (<button className="add" disabled={out} onClick={e => { e.preventDefault(); addToCart({ id: p.id, name: p.name, price: Number(p.price), image: p.images?.[0] }); }}>
    <ShoppingBag size={18} />{label && (out ? 'Out of stock' : 'Add to cart')}</button>);
}
