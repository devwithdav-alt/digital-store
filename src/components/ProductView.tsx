'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Minus, Plus, ShoppingBag } from 'lucide-react';
import { addToCart } from '@/lib/cart';
export default function ProductView({ p, price, compare, brandLine }: { p: any; price: string; compare?: string; brandLine: string }) {
  const [img, setImg] = useState(0), [qty, setQty] = useState(1), [tab, setTab] = useState('desc'), r = useRouter();
  const [color, setColor] = useState<string>(p.colors?.[0]?.name ?? ''), [size, setSize] = useState<string>(p.sizes?.[0] ?? '');
  const out = p.stock <= 0, imgs: string[] = p.images ?? [];
  const add = () => addToCart({ id: p.id, name: p.name + (color ? ` (${color}${size ? ', ' + size : ''})` : size ? ` (${size})` : ''), price: Number(p.price), image: imgs[0] }, qty);
  return (<div className="wrap pv">
    <div className="gal"><div className="main">{imgs[img] ? <img key={img} src={imgs[img]} alt={p.name} /> : <Package size={140} strokeWidth={1} color="var(--primary)" />}</div>
      {imgs.length > 1 && <div className="thumbs">{imgs.map((u, i) => <button key={u} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}><img src={u} alt="" /></button>)}</div>}</div>
    <div className="info"><small>{brandLine}</small><h1>{p.name}</h1>
      <div className="pr big"><b>{price}</b>{compare && <s>{compare}</s>}</div>
      <p className={out ? 'stk out' : 'stk'}>{out ? 'Out of stock' : p.stock <= 10 ? `Only ${p.stock} left in stock` : 'In stock'}</p>
      {p.colors?.length > 0 && <div className="opt"><span>Color: {color}</span><div className="sw">{p.colors.map((c: any) => <button key={c.name} aria-label={c.name} className={c.name === color ? 'on' : ''} style={{ background: c.hex }} onClick={() => setColor(c.name)} />)}</div></div>}
      {p.sizes?.length > 0 && <div className="opt"><span>Size: {size}</span><div className="sz">{p.sizes.map((z: string) => <button key={z} className={z === size ? 'on' : ''} onClick={() => setSize(z)}>{z}</button>)}</div></div>}
      <div className="opt"><span>Quantity</span><div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less"><Minus size={16} /></button><b>{qty}</b><button onClick={() => setQty(Math.min(p.stock || 1, qty + 1))} aria-label="More"><Plus size={16} /></button></div></div>
      <div className="buy"><button className="btn blue" disabled={out} onClick={add}><ShoppingBag size={18} />Add to cart</button>
        <button className="btn" disabled={out} onClick={() => { add(); r.push('/checkout'); }}>Buy it now</button></div></div>
    <div className="ptabs"><div className="tabs left"><button className={tab === 'desc' ? 'on' : ''} onClick={() => setTab('desc')}>Description</button><button className={tab === 'spec' ? 'on' : ''} onClick={() => setTab('spec')}>Specifications</button></div>
      {tab === 'desc' ? <p className="ptxt">{p.description || 'Description coming soon.'}</p> :
        <table className="spec"><tbody>{Object.entries(p.specs ?? {}).map(([k, v]) => <tr key={k}><th>{k}</th><td>{String(v)}</td></tr>)}</tbody></table>}</div></div>);
}
