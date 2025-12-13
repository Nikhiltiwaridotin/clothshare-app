// API Configuration - Uses Supabase for production
import { authAPI as supabaseAuth, itemsAPI as supabaseItems, rentalsAPI as supabaseRentals, checkServerHealth as supabaseHealth } from './supabaseApi';

// Re-export everything from supabaseApi
export const authAPI = supabaseAuth;
export const itemsAPI = supabaseItems;
export const rentalsAPI = supabaseRentals;
export const checkServerHealth = supabaseHealth;

// Check if Supabase is configured (re-exported for convenience if needed, though usually imported from lib/supabase)
export { isSupabaseConfigured } from './lib/supabase';
