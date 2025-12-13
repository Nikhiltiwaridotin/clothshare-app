import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, itemsAPI } from '../api';
import { campuses, categories } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
    // User state
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Location state
    const [selectedCampus, setSelectedCampus] = useState(campuses[0]);
    const [searchRadius, setSearchRadius] = useState(200);
    const [userLocation, setUserLocation] = useState(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [sortBy, setSortBy] = useState('distance');

    // Items state
    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    // UI state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [savedItems, setSavedItems] = useState([]);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = authAPI.getToken();
            if (token) {
                try {
                    const data = await authAPI.getMe();
                    setCurrentUser(data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    authAPI.logout();
                }
            }
            setAuthLoading(false);
        };
        checkAuth();
    }, []);

    // Load items from API
    useEffect(() => {
        const loadItems = async () => {
            setItemsLoading(true);
            try {
                const data = await itemsAPI.getAll();
                if (data.items) {
                    // Add mock distance for now (until we have real geolocation)
                    const itemsWithDistance = data.items.map(item => ({
                        ...item,
                        distance: Math.floor(Math.random() * 250) + 50,
                        rating: item.rating || (4 + Math.random()).toFixed(1),
                        reviewCount: item.review_count || Math.floor(Math.random() * 20)
                    }));
                    setItems(itemsWithDistance);
                }
            } catch (error) {
                console.error('Failed to load items:', error);
                // Fall back to mock data if API fails
                const { items: mockItems } = await import('../data/mockData');
                setItems(mockItems);
            }
            setItemsLoading(false);
        };
        loadItems();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const data = await authAPI.login({ email, password });
            setCurrentUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            const data = await authAPI.register(userData);
            setCurrentUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        authAPI.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    // Save/unsave item
    const toggleSaveItem = (itemId) => {
        setSavedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Refresh items
    const refreshItems = async () => {
        try {
            const data = await itemsAPI.getAll();
            if (data.items) {
                const itemsWithDistance = data.items.map(item => ({
                    ...item,
                    distance: Math.floor(Math.random() * 250) + 50,
                    rating: item.rating || (4 + Math.random()).toFixed(1),
                    reviewCount: item.review_count || Math.floor(Math.random() * 20)
                }));
                setItems(itemsWithDistance);
            }
        } catch (error) {
            console.error('Failed to refresh items:', error);
        }
    };

    // Filter items based on current filters
    const getFilteredItems = () => {
        return items.filter(item => {
            // Distance filter
            if (item.distance > searchRadius) return false;

            // Search query
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category filter
            if (selectedCategory && item.category !== selectedCategory) {
                return false;
            }

            // Size filter
            if (selectedSize && item.size !== selectedSize) {
                return false;
            }

            // Price filter
            const price = item.daily_price || item.dailyPrice;
            if (price < priceRange.min || price > priceRange.max) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            const priceA = a.daily_price || a.dailyPrice;
            const priceB = b.daily_price || b.dailyPrice;

            switch (sortBy) {
                case 'distance':
                    return a.distance - b.distance;
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
                default:
                    return a.distance - b.distance;
            }
        });
    };

    const value = {
        // User
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        authLoading,
        login,
        signup,
        logout,

        // Location
        selectedCampus,
        setSelectedCampus,
        searchRadius,
        setSearchRadius,
        userLocation,
        setUserLocation,
        campuses,
        categories,

        // Items
        items,
        itemsLoading,
        refreshItems,

        // Search & Filters
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSize,
        setSelectedSize,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        getFilteredItems,

        // UI
        isMobileMenuOpen,
        setIsMobileMenuOpen,

        // Saved Items
        savedItems,
        toggleSaveItem
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
