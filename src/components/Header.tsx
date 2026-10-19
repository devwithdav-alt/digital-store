'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
export default function Header({ brand }: { brand: any }) {
  const path = usePathname(), [y, setY] = useState(false), [n, setN] = useState(0);
  useEffect(() => { const f = () => { try { setN(JSON.parse(localStorage.getItem('ds_cart') || '[]').reduce((a: number, i: any) => a + i.qty, 0)); } catch {} }; f(); window.addEventListener('cart', f); return () => window.removeEventListener('cart', f); }, []);
  useEffect(() => { const f = () => setY(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  const solid = y || path !== '/';
  return (<header className={'hdr' + (solid ? ' solid' : '')}><div className="hwrap">
    <Link href="/" aria-label={brand.name} className="logo"><img src={brand.logo_url} alt={brand.name} /></Link>
    <nav className="navbox" aria-label="Main">
      <span className="links"><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/about">About Us</Link><Link href="/contact">Contact Us</Link></span>
      <span className="icons"><Link href="/shop?search=" aria-label="Search"><Search size={20} /></Link>
        <Link href="/cart" aria-label="Cart"><ShoppingBag size={20} /><span className="badge" id="cart-count">{n}</span></Link></span>
    </nav></div></header>);
}
