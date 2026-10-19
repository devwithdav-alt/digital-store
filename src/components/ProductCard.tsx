import Link from 'next/link';
import { Package } from 'lucide-react';
import AddToCart from './AddToCart';
import { money } from '@/lib/products';
export default function ProductCard({ p, cur }: { p: any; cur: string }) {
  const off = p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  return (<article className="pc">
    <Link href={`/product/${p.slug}`} className="pimg">
      {off > 0 && <span className="tag">-{off}%</span>}
      {p.stock <= 0 && <span className="tag out">Sold out</span>}
      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <Package size={72} strokeWidth={1.2} color="var(--primary)" />}
      <AddToCart p={p} /></Link>
    <small>{p.categories?.name}</small>
    <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
    <div className="pr"><b>{money(p.price, cur)}</b>{off > 0 && <s>{money(p.compare_price, cur)}</s>}</div>
    {p.stock > 0 && p.stock <= 10 && <em className="low">Stock left: {p.stock}</em>}
  </article>);
}
