import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://wxdwpnuxxcpsfgjfmxax.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_tUcet2L_SNDtrPyJwIO91w_wrCsrWwj';

export const supabase = createClient(url, key);
