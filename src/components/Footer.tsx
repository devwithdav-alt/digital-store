import Link from 'next/link';
import { ChevronDown, Headphones, Facebook, Instagram, Youtube } from 'lucide-react';
export default function Footer({ s }: { s: any }) {
  return (<footer className="ftr"><div className="wrap"><div className="top">
    <div>
      <div className="call"><Headphones size={56} color="var(--accent)" strokeWidth={1.5} />
        <div>Got questions? Call us 24/7<b>{s.contact.phone}</b></div></div>
      <p style={{ marginTop: 24 }}>Address: {s.contact.address}</p>
      <p>Email: {s.contact.email}</p>
      <div className="soc">
        <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
        <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
        <a href="#" aria-label="YouTube"><Youtube size={18} /></a></div>
    </div>
    <div className="acc">{s.footer.groups.map((g: any) => (
      <details key={g.title}><summary>{g.title}<ChevronDown size={18} /></summary>
        <ul>{g.links.map((l: any) => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul></details>))}</div>
  </div>
  <div className="legal"><div className="pay">{s.payments?.banners?.length ? s.payments.banners.map((u: string) => <img key={u} src={u} alt="Payment method" />) : ['Visa', 'Mastercard', 'MTN MoMo', 'Paystack'].map(n => <span key={n}>{n}</span>)}</div>Copyright 2026 {s.brand.name}. All rights reserved. Built by DevwithDav.</div></div></footer>);
}
