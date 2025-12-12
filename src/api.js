// API Configuration - Uses Supabase for production, local server for development
import { isSupabaseConfigured } from './lib/supabase';
import * as supabaseAPI from './supabaseApi';

// Check if we should use Supabase (production) or local server (development)
const useSupabase = isSupabaseConfigured();

// If Supabase is configured, use it; otherwise fall back to local server
if (useSupabase) {
    console.log('🚀 Using Supabase backend');
} else {
    console.log('⚠️ Supabase not configured, using local server on port 5000');
}

// Local server configuration (for development)
const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth header for local server
const getAuthHeader = () => {
    const token = localStorage.getItem('clothshare_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic fetch wrapper for local server
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers
        },
        ...options
    };

    try {
        console.log(`API Request: ${config.method || 'GET'} ${url}`);
        const response = await fetch(url, config);

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            throw new Error('Server returned invalid response');
        }

        if (!response.ok) {
            console.error('API Error Response:', data);
            throw new Error(data.error || data.message || 'API request failed');
        }

        console.log(`API Success: ${endpoint}`, data);
        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.error('Network Error: Server not reachable at', url);
            throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
        }
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// ============================================
// AUTH API - Hybrid (Supabase + Local)
// ============================================
export const authAPI = useSupabase ? {
    // Use Supabase API
    ...supabaseAPI.authAPI,

    // Send OTP (Magic Link) - NEW!
    sendOTP: supabaseAPI.authAPI.sendOTP,
    verifyOTP: supabaseAPI.authAPI.verifyOTP,

    // Update password (for magic link users to set password)
    updatePassword: supabaseAPI.authAPI.updatePassword,
} : {
    // Local server fallback
    register: async (userData) => {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        if (data.token) {
            localStorage.setItem('clothshare_token', data.token);
            localStorage.setItem('clothshare_user', JSON.stringify(data.user));
        }
        return data;
    },

    login: async (credentials) => {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (data.token) {
            localStorage.setItem('clothshare_token', data.token);
            localStorage.setItem('clothshare_user', JSON.stringify(data.user));
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('clothshare_token');
        localStorage.removeItem('clothshare_user');
    },

    getMe: async () => {
        return apiCall('/auth/me');
    },

    updateProfile: async (profileData) => {
        const data = await apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        if (data.user) {
            localStorage.setItem('clothshare_user', JSON.stringify(data.user));
        }
        return data;
    },

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

    // Stub for OTP (not available on local server)
    sendOTP: async () => {
        throw new Error('OTP login requires Supabase configuration');
    },
    verifyOTP: async () => {
        throw new Error('OTP login requires Supabase configuration');
    }
};

// ============================================
// ITEMS API
// ============================================
export const itemsAPI = useSupabase ? supabaseAPI.itemsAPI : {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiCall(`/items${query}`);
    },

    getById: async (id) => {
        return apiCall(`/items/${id}`);
    },

    create: async (itemData) => {
        return apiCall('/items', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    },

    update: async (id, itemData) => {
        return apiCall(`/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
        });
    },

    delete: async (id) => {
        return apiCall(`/items/${id}`, {
            method: 'DELETE'
        });
    },

    getMyItems: async () => {
        return apiCall('/items/user/my-items');
    }
};

// ============================================
// RENTALS API
// ============================================
export const rentalsAPI = useSupabase ? supabaseAPI.rentalsAPI : {
    create: async (rentalData) => {
        return apiCall('/rentals', {
            method: 'POST',
            body: JSON.stringify(rentalData)
        });
    },

    getMyRentals: async () => {
        return apiCall('/rentals/my-rentals');
    },

    getRequests: async () => {
        return apiCall('/rentals/requests');
    },

    accept: async (id) => {
        return apiCall(`/rentals/${id}/accept`, {
            method: 'PUT'
        });
    },

    reject: async (id) => {
        return apiCall(`/rentals/${id}/reject`, {
            method: 'PUT'
        });
    },

    complete: async (id) => {
        return apiCall(`/rentals/${id}/complete`, {
            method: 'PUT'
        });
    }
};

// ============================================
// HEALTH CHECK
// ============================================
export const checkServerHealth = async () => {
    if (useSupabase) {
        return supabaseAPI.checkServerHealth();
    }

    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};

// Export info about which backend is being used
export const getBackendInfo = () => ({
    isSupabase: useSupabase,
    configured: useSupabase ? 'Supabase Cloud' : 'Local Server (port 5000)'
});
