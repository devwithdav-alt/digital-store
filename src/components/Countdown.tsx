'use client';
import { useEffect, useState } from 'react';
export default function Countdown({ ends }: { ends: string }) {
  const [l, setL] = useState<number | null>(null);
  useEffect(() => { const f = () => setL(Math.max(0, new Date(ends).getTime() - Date.now())); f(); const t = setInterval(f, 1000); return () => clearInterval(t); }, [ends]);
  if (l === null) return <div className="cd" />;
  const u = [[Math.floor(l / 864e5), 'd'], [Math.floor(l / 36e5) % 24, 'h'], [Math.floor(l / 6e4) % 60, 'm'], [Math.floor(l / 1e3) % 60, 's']];
  return <div className="cd">{u.map(([v, k]) => <span key={k as string}>{String(v).padStart(2, '0')}{k}</span>)}</div>;
}
