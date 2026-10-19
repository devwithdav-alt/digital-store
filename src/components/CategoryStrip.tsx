'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Camera, Laptop, Headphones, Keyboard, Gamepad2, Watch } from 'lucide-react';
const ICONS: Record<string, any> = { phones: Smartphone, camera: Camera, laptop: Laptop, headphone: Headphones, keyboard: Keyboard, game: Gamepad2, watch: Watch };
export default function CategoryStrip({ cats }: { cats: { name: string; slug: string; image_url: string | null }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * 420, behavior: 'smooth' });
  return (<div className="strip"><div className="pillbg" />
    <button className="sarrow l" onClick={() => go(-1)} aria-label="Scroll left"><ChevronLeft size={20} /></button>
    <div className="scroller" ref={ref}>{cats.map(c => { const Ic = ICONS[c.slug] ?? Smartphone; return (
      <Link key={c.slug} href={`/shop?category=${c.slug}`} className="scat">
        <span className="sbox">{c.image_url ? <img src={c.image_url} alt={c.name} /> : <Ic size={64} strokeWidth={1.4} />}</span>
        <b>{c.name}</b></Link>); })}</div>
    <button className="sarrow r" onClick={() => go(1)} aria-label="Scroll right"><ChevronRight size={20} /></button></div>);
}
