import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, itemsAPI } from '../api';
import { campuses, categories } from '../data/mockData';

const AppContext = createContext();

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

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

    // Cart state
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('clothshare_cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Logout function
    const logout = useCallback(() => {
        authAPI.logout();
        localStorage.removeItem('clothshare_login_time');
        setCurrentUser(null);
        setIsAuthenticated(false);
    }, []);

    // Check session timeout
    const checkSessionTimeout = useCallback(() => {
        const loginTime = localStorage.getItem('clothshare_login_time');
        if (loginTime) {
            const elapsed = Date.now() - parseInt(loginTime, 10);
            if (elapsed > SESSION_TIMEOUT) {
                console.log('Session expired after 30 minutes');
                logout();
                return true;
            }
        }
        return false;
    }, [logout]);

    // Update login time when user authenticates
    const updateLoginTime = useCallback(() => {
        localStorage.setItem('clothshare_login_time', Date.now().toString());
    }, []);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            // First check if session has expired
            if (checkSessionTimeout()) {
                setAuthLoading(false);
                return;
            }

            const token = authAPI.getToken();
            if (token) {
                try {
                    const data = await authAPI.getMe();
                    setCurrentUser(data.user);
                    setIsAuthenticated(true);

                    // If no login time exists, set it now
                    if (!localStorage.getItem('clothshare_login_time')) {
                        updateLoginTime();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setAuthLoading(false);
        };
        checkAuth();
    }, [checkSessionTimeout, logout, updateLoginTime]);

    // Session timeout checker - runs every minute
    useEffect(() => {
        if (!isAuthenticated) return;

        const intervalId = setInterval(() => {
            checkSessionTimeout();
        }, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [isAuthenticated, checkSessionTimeout]);

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
            updateLoginTime(); // Set login time on successful login
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
            updateLoginTime(); // Set login time on successful signup
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
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
        updateLoginTime,

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
        toggleSaveItem,

        // Cart
        cartItems,
        addToCart: (item, rentalDays = 1, startDate = null, endDate = null) => {
            const existingIndex = cartItems.findIndex(ci => ci.id === item.id);
            let newCart;
            if (existingIndex >= 0) {
                // Update existing item
                newCart = [...cartItems];
                newCart[existingIndex] = { ...item, rentalDays, startDate, endDate };
            } else {
                newCart = [...cartItems, { ...item, rentalDays, startDate, endDate }];
            }
            setCartItems(newCart);
            localStorage.setItem('clothshare_cart', JSON.stringify(newCart));
        },
        removeFromCart: (itemId) => {
            const newCart = cartItems.filter(item => item.id !== itemId);
            setCartItems(newCart);
            localStorage.setItem('clothshare_cart', JSON.stringify(newCart));
        },
        clearCart: () => {
            setCartItems([]);
            localStorage.removeItem('clothshare_cart');
        },
        getCartTotal: () => {
            return cartItems.reduce((total, item) => {
                const price = item.daily_price || item.dailyPrice || 0;
                const deposit = item.security_deposit || item.securityDeposit || 0;
                return total + (price * (item.rentalDays || 1)) + deposit;
            }, 0);
        },
        cartCount: cartItems.length
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
