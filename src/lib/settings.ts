import { sb } from './supabase';
export const DEFAULTS: Record<string, any> = {
  brand:{name:'Digital Store',tagline:'We add care in electronic product',logo_url:'/logo.png'},
  theme:{base:'#FFFFFF',surface:'#F4F6F9',text:'#333333',primary:'#0066CC',dark:'#000000',cta:'#FF6A00',accent:'#19D3E6',danger:'#D92D20'},
  contact:{phone:'+233 00 000 0000',whatsapp:'233000000000',email:'hello@digitalstore.demo',address:'Accra, Ghana'},
  currency:'GH₵',
  payments:{banners:[]},
  showcase:{category:'phones',title:'Xiaomi Redmi Note',sub:'Starting at 1,200',bg:'linear-gradient(160deg,#020520,#0066CC)'},
  bundle:{pct:30,count:3},
  delivery:{free_over:500,fee:30},
  brands:['Apple','Samsung','Sony','Dell','Logitech','DJI','Huawei','Lenovo'].map(name=>({name,logo:''})),
  feature:{big:'Stronger & Faster',specs:['Intel Core Ultra 9 275HX','NVIDIA RTX 5070 Ti 12GB GDDR7','32GB DDR5 6400','1TB NVMe SSD Gen4'],image:'',video:''},
  deal:{title:'Smart Watch Pro',text:'Sale up to 40%',ends:'2026-12-31T23:59:00'},
  promos:[{title:'Game Controllers',sub:'Starting at 250',bg:'linear-gradient(120deg,#FF6A00,#ffb347)',icon:'game',image:''},{title:'Action Cameras',sub:'Starting at 900',bg:'linear-gradient(120deg,#0066CC,#19D3E6)',icon:'camera',image:''},{title:'Bluetooth Speakers',sub:'Starting at 180',bg:'linear-gradient(120deg,#000,#0a2a66)',icon:'speaker',image:''}],
  benefits:[{icon:'truck',t:'Free Shipping',d:'On orders over 500'},{icon:'shield',t:'Money Guarantee',d:'7 days for an exchange'},{icon:'headset',t:'Online Support',d:'Open daily 9am to 7pm'},{icon:'card',t:'Flexible Payment',d:'Card, MoMo or WhatsApp'}],
  hero:[{title:'Wireless Headphone',text:'Immersive sound, all day battery.',cta:'Shop now',href:'/shop',image:''},{title:'Smart Watches',text:'Track more. Charge less.',cta:'Explore',href:'/shop',image:''}],
  footer:{groups:[{title:'Store Location',links:[{label:'Accra',href:'/contact'}]},{title:'About Us',links:[{label:'Our Story',href:'/about'},{label:'Contact Us',href:'/contact'}]},{title:'Get Help',links:[{label:'Privacy Policy',href:'/contact#privacy'},{label:'Terms and Conditions',href:'/contact#terms'},{label:'Refund Policy',href:'/contact#refund'},{label:'Shipping and Delivery',href:'/contact#shipping'}]}]},
};
export async function getSettings() {
  const out = { ...DEFAULTS };
  try { const { data } = await sb().from('settings').select('key,value'); data?.forEach(r => { out[r.key] = r.value; }); } catch {}
  return out;
}
