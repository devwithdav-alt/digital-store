'use client';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
export default function Tabs({ tabs, cur }: { tabs: { name: string; items: any[] }[]; cur: string }) {
  const [t, setT] = useState(0), [p, setP] = useState(0), ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (<div><div className="tabs" role="tablist">{tabs.map((x, i) => <button key={x.name} role="tab" aria-selected={i === t} className={i === t ? 'on' : ''} onClick={() => { setT(i); setP(0); }}>{x.name}</button>)}</div>
    <div className="hs" key={t} ref={ref} onScroll={e => { const el = e.currentTarget; setP(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)); }}>
      {tabs[t].items.map(x => <div className="hs-i" key={x.id}><ProductCard p={x} cur={cur} /></div>)}</div>
    <div className="hctl"><button onClick={() => go(-1)} aria-label="Previous"><ChevronLeft size={18} /></button>
      <div className="hbar"><i style={{ width: '35%', left: `${p * 65}%` }} /></div>
      <button onClick={() => go(1)} aria-label="Next"><ChevronRight size={18} /></button></div></div>);
}
