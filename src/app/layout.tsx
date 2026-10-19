import './globals.css';
import { Nunito_Sans } from 'next/font/google';
import { getSettings } from '@/lib/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealInit from '@/components/RevealInit';
import ScrollTop from '@/components/ScrollTop';
const font = Nunito_Sans({ subsets:['latin'], weight:['400','700','800','900'], variable:'--font' });
export const revalidate = 60;
export async function generateMetadata() {
  const s = await getSettings();
  return { title:{ default:`${s.brand.name} | Electronics Store`, template:`%s | ${s.brand.name}` }, description:s.brand.tagline, icons:{ icon:s.brand.logo_url } };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings(), t = s.theme;
  const vars = `:root{--base:${t.base};--surface:${t.surface};--text:${t.text};--primary:${t.primary};--dark:${t.dark};--cta:${t.cta};--accent:${t.accent};--danger:${t.danger}}`;
  return (<html lang="en" className={font.variable} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /><style dangerouslySetInnerHTML={{ __html: vars }} /></head>
    <body><Header brand={s.brand} /><main>{children}</main><Footer s={s} /><ScrollTop /><RevealInit /></body></html>);
}
