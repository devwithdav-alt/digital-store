'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export default function RevealInit() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const t = setTimeout(() => document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el)), 50);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return null;
}
