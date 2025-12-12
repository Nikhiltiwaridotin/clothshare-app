import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These are public keys - safe to expose in frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== 'https://your-project.supabase.co' &&
        supabaseAnonKey !== 'your-anon-key';
};

export default supabase;
