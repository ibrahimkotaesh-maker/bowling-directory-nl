import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Only create the client if env vars are present
export const supabase: SupabaseClient = url && key
    ? createClient(url, key)
    : (new Proxy({}, {
        get() { return async () => ({ data: null, error: new Error('Supabase not configured') }); }
    }) as unknown as SupabaseClient);
