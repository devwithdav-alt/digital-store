import { createClient } from '@supabase/supabase-js';
export const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://invalid.local', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing');
