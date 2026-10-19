export type CartItem = { id: string; name: string; price: number; image?: string; qty: number };
const K = 'ds_cart';
export const readCart = (): CartItem[] => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } };
export function addToCart(i: Omit<CartItem, 'qty'>, qty = 1) {
  const c = readCart(), f = c.find(x => x.id === i.id);
  f ? (f.qty += qty) : c.push({ ...i, qty });
  try { localStorage.setItem(K, JSON.stringify(c)); } catch {}
  window.dispatchEvent(new Event('cart'));
}
