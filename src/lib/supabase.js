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

// Upload image to Supabase Storage
export const uploadItemImage = async (file, userId) => {
    if (!file) throw new Error('No file provided');

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { data, error } = await supabase.storage
        .from('item-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Upload error:', error);
        throw new Error('Failed to upload image. Please try again.');
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
};

// Upload multiple images
export const uploadItemImages = async (files, userId) => {
    const uploadPromises = files.map(file => uploadItemImage(file, userId));
    return Promise.all(uploadPromises);
};

export default supabase;
