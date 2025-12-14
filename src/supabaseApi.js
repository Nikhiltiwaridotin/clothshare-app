// Supabase API - Cloud-based backend for ClothShare
import { supabase, isSupabaseConfigured } from './lib/supabase';

// ============================================
// AUTH API - Email OTP (Magic Link) Authentication
// ============================================
export const authAPI = {
    // Send OTP to email (Magic Link)
    sendOTP: async (email) => {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
        }

        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) throw error;
        return { success: true, message: 'Check your email for the magic link!' };
    },

    // Verify OTP code (if using 6-digit code)
    verifyOTP: async (email, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
        });

        if (error) throw error;

        // Create or update user profile
        if (data.user) {
            await authAPI.ensureProfile(data.user);
        }

        return { success: true, user: data.user, session: data.session };
    },

    // Register with email and password (traditional signup)
    register: async (userData) => {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
        }

        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                    phone: userData.phone || '',
                    campus: userData.campus || '',
                    building: userData.building || ''
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) throw error;

        // Wait for user to confirm email if needed
        if (data.user && !data.session) {
            return {
                success: true,
                message: 'Please check your email to confirm your account!',
                needsConfirmation: true
            };
        }

        // Create profile
        if (data.user) {
            await authAPI.createProfile(data.user, userData);
        }

        // Store token
        if (data.session) {
            localStorage.setItem('clothshare_token', data.session.access_token);
            localStorage.setItem('clothshare_user', JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: userData.name,
                phone: userData.phone,
                campus: userData.campus,
                building: userData.building
            }));
        }

        return {
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: userData.name,
                ...userData
            },
            token: data.session?.access_token
        };
    },

    // Login with email and password
    login: async (credentials) => {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        });

        if (error) throw error;

        // Fetch user profile
        const profile = await authAPI.getProfile(data.user.id);

        const user = {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || data.user.user_metadata?.name || data.user.email.split('@')[0],
            phone: profile?.phone || data.user.user_metadata?.phone,
            campus: profile?.campus || data.user.user_metadata?.campus,
            building: profile?.building || data.user.user_metadata?.building,
            avatar: profile?.avatar,
            bio: profile?.bio,
            rating: profile?.rating || 0,
            review_count: profile?.review_count || 0
        };

        localStorage.setItem('clothshare_token', data.session.access_token);
        localStorage.setItem('clothshare_user', JSON.stringify(user));

        return { success: true, user, token: data.session.access_token };
    },

    // Logout
    logout: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('clothshare_token');
        localStorage.removeItem('clothshare_user');
    },

    // Get current user
    getMe: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            throw new Error('Not authenticated');
        }

        const profile = await authAPI.getProfile(user.id);

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: profile?.name || user.user_metadata?.name || user.email.split('@')[0],
                phone: profile?.phone || user.user_metadata?.phone,
                campus: profile?.campus || user.user_metadata?.campus,
                building: profile?.building || user.user_metadata?.building,
                avatar: profile?.avatar,
                bio: profile?.bio,
                rating: profile?.rating || 0,
                review_count: profile?.review_count || 0
            }
        };
    },

    // Get user profile from database
    getProfile: async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
        }

        return data;
    },

    // Create user profile
    createProfile: async (user, userData) => {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
                name: userData.name,
                phone: userData.phone || null,
                campus: userData.campus || null,
                building: userData.building || null,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error creating profile:', error);
        }
    },

    // Ensure profile exists
    ensureProfile: async (user) => {
        const existing = await authAPI.getProfile(user.id);
        if (!existing) {
            await authAPI.createProfile(user, {
                name: user.user_metadata?.name || user.email.split('@')[0],
                phone: user.user_metadata?.phone,
                campus: user.user_metadata?.campus,
                building: user.user_metadata?.building
            });
        }
    },

    // Update profile
    updateProfile: async (profileData) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profiles')
            .update({
                name: profileData.name,
                phone: profileData.phone,
                bio: profileData.bio,
                campus: profileData.campus,
                building: profileData.building,
                avatar: profileData.avatar
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;

        const updatedUser = { ...data, email: user.email };
        localStorage.setItem('clothshare_user', JSON.stringify(updatedUser));

        return { success: true, user: updatedUser };
    },

    // Helper functions
    getStoredUser: () => {
        const user = localStorage.getItem('clothshare_user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('clothshare_token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('clothshare_token');
    },

    // Check current session
    getSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    // Update/Set password (for users who signed up via magic link)
    updatePassword: async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        return { success: true, message: 'Password updated successfully!' };
    }
};

// ============================================
// ITEMS API
// ============================================
export const itemsAPI = {
    getAll: async (filters = {}) => {
        let query = supabase
            .from('items')
            .select(`
                *,
                profiles:user_id (name, avatar, rating, campus, building)
            `)
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.size) {
            query = query.eq('size', filters.size);
        }
        if (filters.minPrice) {
            query = query.gte('daily_price', filters.minPrice);
        }
        if (filters.maxPrice) {
            query = query.lte('daily_price', filters.maxPrice);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to match expected format
        const items = data.map(item => ({
            ...item,
            owner: item.profiles,
            images: item.images || []
        }));

        return { items };
    },

    getById: async (id) => {
        const { data, error } = await supabase
            .from('items')
            .select(`
                *,
                profiles:user_id (id, name, email, avatar, rating, review_count, campus, building, bio)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Increment view count
        await supabase
            .from('items')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);

        return {
            item: {
                ...data,
                owner: data.profiles
            }
        };
    },

    create: async (itemData) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated. Please log in to list items.');

        // Ensure user profile exists before creating item (required by RLS)
        await authAPI.ensureProfile(user);

        try {
            const { data, error } = await supabase
                .from('items')
                .insert({
                    user_id: user.id,
                    title: itemData.title,
                    description: itemData.description,
                    category: itemData.category,
                    subcategory: itemData.subcategory,
                    size: itemData.size,
                    color: itemData.color,
                    brand: itemData.brand,
                    item_condition: itemData.condition || itemData.item_condition,
                    daily_price: itemData.dailyPrice || itemData.daily_price,
                    security_deposit: itemData.securityDeposit || itemData.security_deposit || 0,
                    weekly_discount: itemData.weeklyDiscount || itemData.weekly_discount || 0,
                    images: itemData.images || [],
                    status: 'available'
                })
                .select()
                .single();

            if (error) {
                console.error('Item creation error:', error);
                if (error.code === '42501') {
                    throw new Error('Permission denied. Please try logging out and back in.');
                }
                if (error.code === '23503') {
                    throw new Error('Profile not found. Please complete your profile first.');
                }
                throw new Error(error.message || 'Failed to create item');
            }

            return { success: true, item: data };
        } catch (err) {
            console.error('Create item error:', err);
            throw err;
        }
    },

    update: async (id, itemData) => {
        const { data, error } = await supabase
            .from('items')
            .update({
                title: itemData.title,
                description: itemData.description,
                category: itemData.category,
                size: itemData.size,
                color: itemData.color,
                brand: itemData.brand,
                item_condition: itemData.condition || itemData.item_condition,
                daily_price: itemData.dailyPrice || itemData.daily_price,
                security_deposit: itemData.securityDeposit || itemData.security_deposit,
                weekly_discount: itemData.weeklyDiscount || itemData.weekly_discount,
                images: itemData.images,
                status: itemData.status
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, item: data };
    },

    delete: async (id) => {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    },

    getMyItems: async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { items: data };
    }
};

// ============================================
// RENTALS API
// ============================================
export const rentalsAPI = {
    create: async (rentalData) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        // Get item to find owner
        const { data: item } = await supabase
            .from('items')
            .select('user_id, daily_price')
            .eq('id', rentalData.item_id || rentalData.itemId)
            .single();

        if (!item) throw new Error('Item not found');

        const startDate = new Date(rentalData.start_date || rentalData.startDate);
        const endDate = new Date(rentalData.end_date || rentalData.endDate);
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const totalAmount = totalDays * item.daily_price;

        const { data, error } = await supabase
            .from('rentals')
            .insert({
                item_id: rentalData.item_id || rentalData.itemId,
                renter_id: user.id,
                owner_id: item.user_id,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                total_days: totalDays,
                daily_rate: item.daily_price,
                total_amount: totalAmount,
                deposit_amount: rentalData.deposit_amount || 0,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, rental: data };
    },

    getMyRentals: async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('rentals')
            .select(`
                *,
                items:item_id (title, images, daily_price),
                owner:owner_id (name, avatar)
            `)
            .eq('renter_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { rentals: data };
    },

    getRequests: async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('rentals')
            .select(`
                *,
                items:item_id (title, images, daily_price),
                renter:renter_id (name, avatar)
            `)
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { requests: data };
    },

    updateStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('rentals')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // If accepted, update item status
        if (status === 'active') {
            await supabase
                .from('items')
                .update({ status: 'rented' })
                .eq('id', data.item_id);
        }

        // If completed, make item available again
        if (status === 'completed') {
            await supabase
                .from('items')
                .update({ status: 'available' })
                .eq('id', data.item_id);
        }

        return { success: true, rental: data };
    },

    accept: async (id) => rentalsAPI.updateStatus(id, 'active'),
    reject: async (id) => rentalsAPI.updateStatus(id, 'rejected'),
    complete: async (id) => rentalsAPI.updateStatus(id, 'completed')
};

// ============================================
// HEALTH CHECK
// ============================================
export const checkServerHealth = async () => {
    try {
        if (!isSupabaseConfigured()) {
            return false;
        }
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        return !error;
    } catch {
        return false;
    }
};

// Export default for backward compatibility
export default {
    authAPI,
    itemsAPI,
    rentalsAPI,
    checkServerHealth
};
