import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import { sb } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
export const metadata = { title: 'Shop' };
export default async function Shop({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams, s = await getSettings(), db = sb();
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const brandsSel = ([] as string[]).concat(sp.brand ?? []);
  const { data: cats } = await db.from('categories').select('*').order('sort');
  const { data: brandRows } = await db.from('products').select('brand').eq('active', true);
  const brands = [...new Set((brandRows ?? []).map(r => r.brand).filter(Boolean))] as string[];
  let q = db.from('products').select('*, categories(name,slug)').eq('active', true);
  const cat = cats?.find(c => c.slug === one('category')); if (cat) q = q.eq('category_id', cat.id);
  if (one('min')) q = q.gte('price', Number(one('min'))); if (one('max')) q = q.lte('price', Number(one('max')));
  if (brandsSel.length) q = q.in('brand', brandsSel); if (one('stock')) q = q.gt('stock', 0);
  const term = (one('search') ?? '').replace(/[%,()]/g, '').slice(0, 60); if (term) q = q.ilike('name', `%${term}%`);
  const sort = one('sort') ?? 'new';
  q = sort === 'low' ? q.order('price') : sort === 'high' ? q.order('price', { ascending: false }) : sort === 'az' ? q.order('name') : q.order('created_at', { ascending: false });
  const { data: items } = await q;
  return (<><section className="phead"><div className="wrap"><h1 className="display" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Shop</h1></div></section>
    <div className="wrap shop">
      <aside><h3>Categories</h3><ul className="cl"><li><Link href="/shop" className={!cat ? 'on' : ''}>All products</Link></li>
        {cats?.map(c => <li key={c.id}><Link href={`/shop?category=${c.slug}`} className={cat?.id === c.id ? 'on' : ''}>{c.name}</Link></li>)}</ul>
        <form method="get"><h3>Filter by</h3>{cat && <input type="hidden" name="category" value={cat.slug} />}
          <fieldset><legend>Price</legend><div className="pr2"><input name="min" type="number" min="0" placeholder="Min" defaultValue={one('min')} aria-label="Minimum price" /><input name="max" type="number" min="0" placeholder="Max" defaultValue={one('max')} aria-label="Maximum price" /></div></fieldset>
          <fieldset><legend>Availability</legend><label><input type="checkbox" name="stock" value="1" defaultChecked={!!one('stock')} /> In stock only</label></fieldset>
          {brands.length > 0 && <fieldset><legend>Brand</legend>{brands.map(b => <label key={b}><input type="checkbox" name="brand" value={b} defaultChecked={brandsSel.includes(b)} /> {b}</label>)}</fieldset>}
          <fieldset><legend>Sort by</legend><select name="sort" defaultValue={sort}><option value="new">Newest</option><option value="az">Alphabetically, A to Z</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option></select></fieldset>
          <button className="btn blue" style={{ width: '100%', justifyContent: 'center' }}>Apply filters</button>
          <Link href="/shop" className="clear">Clear all</Link></form></aside>
      <div><p className="count">Showing {items?.length ?? 0} products</p>
        {items?.length ? <div className="grid g3">{items.map(p => <ProductCard key={p.id} p={p} cur={s.currency} />)}</div> : <p className="empty">No products match these filters. Clear a filter or browse all products.</p>}</div>
    </div></>);
}
