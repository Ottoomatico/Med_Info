import { createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client singleton.
 * Re-uses the same instance across the application.
 */
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (client) return client;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }

    client = createClient(supabaseUrl, supabaseAnonKey);
    return client;
}
