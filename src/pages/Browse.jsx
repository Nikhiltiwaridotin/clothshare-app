import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search,
    MapPin,
    SlidersHorizontal,
    X,
    ChevronDown,
    Grid,
    List,
    Map
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { categories, sizes, colors } from '../data/mockData';
import './Browse.css';

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        selectedCampus,
        setSelectedCampus,
        searchRadius,
        setSearchRadius,
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
        campuses
    } = useApp();

    const [showFilters, setShowFilters] = useState(false);
    const [showCampusDropdown, setShowCampusDropdown] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Handle URL params for category
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams, setSelectedCategory]);

    const filteredItems = getFilteredItems();

    const clearAllFilters = () => {
        setSelectedCategory(null);
        setSelectedSize(null);
        setPriceRange({ min: 0, max: 2000 });
        setSearchQuery('');
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategory || selectedSize || priceRange.min > 0 || priceRange.max < 2000 || searchQuery;

    const sortOptions = [
        { value: 'distance', label: 'Nearest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'newest', label: 'Newest First' }
    ];

    return (
        <div className="browse-page">
            {/* Search Header */}
            <div className="browse-header">
                <div className="container">
                    <div className="browse-header-content">
                        {/* Search Bar */}
                        <div className="browse-search">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search for items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="browse-search-input"
                            />
                            {searchQuery && (
                                <button
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Location Selector */}
                        <div className="browse-location" onClick={() => setShowCampusDropdown(!showCampusDropdown)}>
                            <MapPin size={18} className="location-icon" />
                            <span>{selectedCampus.shortName}</span>
                            <ChevronDown size={16} className={showCampusDropdown ? 'open' : ''} />

                            {showCampusDropdown && (
                                <div className="campus-dropdown">
                                    {campuses.map(campus => (
                                        <button
                                            key={campus.id}
                                            className={`campus-option ${campus.id === selectedCampus.id ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCampus(campus);
                                                setShowCampusDropdown(false);
                                            }}
                                        >
                                            <span>{campus.name}</span>
                                            <span className="campus-city">{campus.city}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Radius Toggle */}
                        <div className="browse-radius">
                            <button
                                className={`radius-btn ${searchRadius === 200 ? 'active' : ''}`}
                                onClick={() => setSearchRadius(200)}
                            >
                                200m
                            </button>
                            <button
                                className={`radius-btn ${searchRadius === 300 ? 'active' : ''}`}
                                onClick={() => setSearchRadius(300)}
                            >
                                300m
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            className={`browse-filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={18} />
                            <span className="hide-mobile">Filters</span>
                            {hasActiveFilters && <span className="filter-badge"></span>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="browse-content container">
                {/* Filters Panel */}
                {showFilters && (
                    <aside className="filters-panel">
                        <div className="filters-header">
                            <h3>Filters</h3>
                            {hasActiveFilters && (
                                <button className="clear-filters" onClick={clearAllFilters}>
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <h4 className="filter-title">Category</h4>
                            <div className="filter-options">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="filter-group">
                            <h4 className="filter-title">Size</h4>
                            <div className="filter-options size-options">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`filter-chip size-chip ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="filter-group">
                            <h4 className="filter-title">Price Range (per day)</h4>
                            <div className="price-inputs">
                                <div className="price-input-group">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                        min={0}
                                        placeholder="Min"
                                    />
                                </div>
                                <span className="price-separator">to</span>
                                <div className="price-input-group">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                            <div className="price-presets">
                                <button onClick={() => setPriceRange({ min: 0, max: 100 })}>Under ₹100</button>
                                <button onClick={() => setPriceRange({ min: 100, max: 300 })}>₹100 - ₹300</button>
                                <button onClick={() => setPriceRange({ min: 300, max: 500 })}>₹300 - ₹500</button>
                                <button onClick={() => setPriceRange({ min: 500, max: 2000 })}>₹500+</button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Results */}
                <main className={`browse-results ${showFilters ? 'with-filters' : ''}`}>
                    {/* Results Header */}
                    <div className="results-header">
                        <p className="results-count">
                            <strong>{filteredItems.length}</strong> items found near {selectedCampus.shortName}
                        </p>

                        <div className="results-controls">
                            {/* Sort */}
                            <div className="sort-dropdown">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-input form-select"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Mode */}
                            <div className="view-toggle hide-mobile">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="active-filters">
                            {selectedCategory && (
                                <span className="active-filter">
                                    {categories.find(c => c.id === selectedCategory)?.name}
                                    <button onClick={() => setSelectedCategory(null)}><X size={14} /></button>
                                </span>
                            )}
                            {selectedSize && (
                                <span className="active-filter">
                                    Size: {selectedSize}
                                    <button onClick={() => setSelectedSize(null)}><X size={14} /></button>
                                </span>
                            )}
                            {(priceRange.min > 0 || priceRange.max < 2000) && (
                                <span className="active-filter">
                                    ₹{priceRange.min} - ₹{priceRange.max}
                                    <button onClick={() => setPriceRange({ min: 0, max: 2000 })}><X size={14} /></button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Items Grid */}
                    {filteredItems.length > 0 ? (
                        <div className={`items-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                            {filteredItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No items found</h3>
                            <p>Try adjusting your filters or search in a different area</p>
                            <button className="btn btn-secondary" onClick={clearAllFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
