import { NextResponse } from 'next/server';
import { z } from 'zod';
import { price } from '@/lib/pricing';
const S = z.object({ items: z.array(z.object({ id: z.string().uuid(), qty: z.number().int().min(1).max(20) })).min(1).max(30), code: z.string().max(40).optional(), method: z.enum(['delivery', 'pickup']) });
export async function POST(req: Request) {
  try { const b = S.parse(await req.json()); const q = await price(b.items, b.code, b.method); return NextResponse.json({ ...q, lines: undefined });
  } catch (e: any) { return NextResponse.json({ error: e?.issues ? 'Invalid request' : e.message }, { status: 400 }); }
}
