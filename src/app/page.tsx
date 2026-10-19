import Link from 'next/link';
import { Smartphone, Camera, Laptop, Headphones, Keyboard, Gamepad2, Watch, Truck, ShieldCheck, Headset, CreditCard, Speaker } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { sb } from '@/lib/supabase';
import { getProducts } from '@/lib/products';
import HeroSlider from '@/components/HeroSlider';
import CategoryStrip from '@/components/CategoryStrip';
import ProductCard from '@/components/ProductCard';
import DealCard from '@/components/DealCard';
import Tabs from '@/components/Tabs';
import BundleBuilder from '@/components/BundleBuilder';
const BEN: Record<string, any> = { truck: Truck, shield: ShieldCheck, headset: Headset, card: CreditCard };
const PI: Record<string, any> = { game: Gamepad2, camera: Camera, speaker: Speaker, phone: Smartphone, laptop: Laptop, headphone: Headphones, keyboard: Keyboard, watch: Watch };
const FALLBACK = ['phones', 'camera', 'laptop', 'headphone', 'keyboard', 'game', 'watch'].map(k => ({ name: k[0].toUpperCase() + k.slice(1), slug: k, image_url: null }));
export default async function Home() {
  const s = await getSettings(), cur = s.currency;
  let cats: any[] = FALLBACK;
  try { const { data } = await sb().from('categories').select('*').order('sort'); if (data?.length) cats = data; } catch {}
  const all = await getProducts({ limit: 60 }), sc = s.showcase, f = s.feature;
  const flagged = all.filter(p => p.deal), deals = (flagged.length ? flagged : all.filter(p => p.compare_price > p.price)).slice(0, 2);
  const bs = all.filter(p => p.best_seller), pool = bs.length ? bs : all, bp = all.filter(p => p.bundle_eligible), bpool = bp.length >= s.bundle.count ? bp : all;
  const tabs = cats.map(c => ({ name: c.name, items: pool.filter(p => p.categories?.slug === c.slug).slice(0, 10) })).filter(t => t.items.length);
  const scItems = all.filter(p => p.categories?.slug === sc.category).slice(0, 8), scName = cats.find(x => x.slug === sc.category)?.name ?? sc.category;
  const brands: { name: string; logo?: string }[] = s.brands;
  const specs = [...f.specs, ...f.specs, ...f.specs];
  return (<>
    <HeroSlider slides={s.hero} />
    <div className="over">
      <section className="wrap" style={{ paddingTop: 70 }}><CategoryStrip cats={cats} /></section>
      {deals.length > 0 && <section className="wrap sec"><h2 className="h2 ctr rv">Today&rsquo;s Best Deals</h2>
        <div className="deals rv-s"><DealCard p={deals[0]} cur={cur} ends={s.deal.ends} />
          <div className="feat"><p>{s.deal.text}</p><h3>{s.deal.title}</h3><Watch size={150} strokeWidth={0.9} />
            <div className="fbtn"><Link href="/shop" className="btn ghostb">Explore</Link><Link href="/shop" className="btn wht">Shop now</Link></div></div>
          {deals[1] ? <DealCard p={deals[1]} cur={cur} ends={s.deal.ends} /> : <span />}</div></section>}
      {tabs.length > 0 && <section className="band"><div className="wrap sec"><h2 className="h2 ctr rv">Best Selling Products</h2><Tabs tabs={tabs} cur={cur} /></div></section>}
    </div>
    <section className="promos">{s.promos.map((x: any, i: number) => { const I = PI[x.icon] ?? Gamepad2; return (<Link href="/shop" key={i} className="promo" style={{ background: x.bg }}>
      <div><small>{x.sub}</small><h3>{x.title}</h3><span className="btn wht">Shop now</span></div>
      {x.image ? <img src={x.image} alt="" /> : <I size={190} strokeWidth={0.8} />}</Link>); })}</section>
    <div className="over o2">
      {scItems.length > 0 && <section className="wrap sec"><div className="rowhead rv"><h2 className="h2">{scName}</h2><Link href={`/shop?category=${sc.category}`}>View all</Link></div>
        <div className="showc"><Link href={`/shop?category=${sc.category}`} className="sban rv" style={{ background: sc.image ? `url(${sc.image}) center/cover` : sc.bg }}><h3>{sc.title}</h3><p>{sc.sub}</p><span className="btn">Shop now</span></Link>
          <div className="grid g4 tight rv-s">{scItems.map(p => <ProductCard key={p.id} p={p} cur={cur} />)}</div></div></section>}
      {bpool.length >= s.bundle.count && <section className="wrap sec"><h2 className="h2 rv">Buy {s.bundle.count} Products and <span className="hlt">Save up to {s.bundle.pct}%</span></h2>
        <BundleBuilder cur={cur} count={s.bundle.count} pct={s.bundle.pct} products={bpool.slice(0, 9).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images?.[0] ?? null, slug: p.slug, cat: p.categories?.name ?? '' }))} /></section>}
      <section className="wrap sec"><div className="fban rv">{f.video ? <video src={f.video} autoPlay muted loop playsInline /> : f.image ? <img className="fbg" src={f.image} alt="" /> : null}
        <span className="ghost" aria-hidden>{f.big}</span><div className="smq"><div>{specs.map((x: string, i: number) => <span key={i}>{x}</span>)}</div></div></div></section>
      <section className="wrap ben rv-s">{s.benefits.map((b: any) => { const I = BEN[b.icon] ?? Truck; return <div key={b.t}><I size={44} strokeWidth={1.3} color="var(--primary)" /><b>{b.t}</b><span>{b.d}</span></div>; })}</section>
      <div className="marq"><div>{[...brands, ...brands, ...brands].map((b, i) => b.logo ? <img key={i} src={b.logo} alt={b.name} /> : <span key={i}>{b.name}</span>)}</div></div>
    </div></>);
}
