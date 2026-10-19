import ProductCard from './ProductCard';
import Countdown from './Countdown';
export default function DealCard({ p, cur, ends }: { p: any; cur: string; ends: string }) {
  const sold = p.sold ?? 0, total = sold + p.stock;
  return (<div className="dealc"><ProductCard p={p} cur={cur} />
    <div className="sbar"><div><span>Available: {p.stock}</span><span>Sold: {sold}</span></div><i><b style={{ width: `${total ? (sold / total) * 100 : 0}%` }} /></i></div>
    <Countdown ends={ends} /></div>);
}
