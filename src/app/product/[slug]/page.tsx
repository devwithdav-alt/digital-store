import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/settings';
import { sb } from '@/lib/supabase';
import { money } from '@/lib/products';
import ProductView from '@/components/ProductView';
import ProductCard from '@/components/ProductCard';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const { data } = await sb().from('products').select('name,description').eq('slug', slug).maybeSingle();
  return { title: data?.name ?? 'Product', description: data?.description?.slice(0, 150) };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params, s = await getSettings(), db = sb();
  const { data: p } = await db.from('products').select('*, categories(name,slug)').eq('slug', slug).eq('active', true).maybeSingle();
  if (!p) notFound();
  const { data: rel } = await db.from('products').select('*, categories(name,slug)').eq('active', true).eq('category_id', p.category_id).neq('id', p.id).limit(4);
  const cur = s.currency, off = p.compare_price > p.price;
  return (<div style={{ paddingTop: 120 }}>
    <ProductView p={p} price={money(p.price, cur)} compare={off ? money(p.compare_price, cur) : undefined} brandLine={[p.categories?.name, p.brand].filter(Boolean).join(' / ')} />
    {rel && rel.length > 0 && <section className="wrap sec"><h2 className="h2">Related Products</h2><div className="grid g4">{rel.map(r => <ProductCard key={r.id} p={r} cur={cur} />)}</div></section>}</div>);
}
