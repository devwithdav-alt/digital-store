'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function HeroSlider({ slides }: { slides: any[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(n => (n + 1) % slides.length), 6500); return () => clearInterval(t); }, [slides.length]);
  return (<section className="hero" aria-roledescription="carousel">
    {slides.map((s, n) => (<div key={n} className={'slide' + (n === i ? ' on' : '')} aria-hidden={n !== i}>
      <div className="bg" style={{ backgroundImage: s.image ? `url(${s.image})` : 'linear-gradient(135deg,#020520,#0066CC)' }} />
      <div className="shade" />
      <div className="wrap" style={{ position: 'relative' }}>
        <h1 className="display">{s.title.split(' ').map((w: string, k: number) => <span key={k} className={k === s.title.split(' ').length - 1 && k > 0 ? 'hl' : ''} style={{ ['--i' as any]: k }}>{w}&nbsp;</span>)}</h1>
        <p>{s.text}</p><Link href={s.href} className="btn">{s.cta}</Link></div></div>))}
    <button className="arrow l" onClick={() => setI((i + slides.length - 1) % slides.length)} aria-label="Previous"><ChevronLeft /></button>
    <button className="arrow r" onClick={() => setI((i + 1) % slides.length)} aria-label="Next"><ChevronRight /></button>
    <div className="dots">{slides.map((_, n) => <button key={n} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} />)}</div>
  </section>);
}
