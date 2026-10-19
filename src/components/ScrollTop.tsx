'use client';
import { useEffect, useState } from 'react';
import { ChevronsUp } from 'lucide-react';
export default function ScrollTop() {
  const [v, setV] = useState(false);
  useEffect(() => { const f = () => setV(window.scrollY > 500); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  return <button className={'stop' + (v ? ' show' : '')} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ChevronsUp size={22} /></button>;
}
