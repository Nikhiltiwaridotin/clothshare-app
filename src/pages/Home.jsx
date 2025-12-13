import { Link } from 'react-router-dom';
import {
    Search,
    MapPin,
    ArrowRight,
    Sparkles,
    Users,
    Leaf,
    Shield,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { categories, items } from '../data/mockData';
import './Home.css';

export default function Home() {
    const {
        selectedCampus,
        setSelectedCampus,
        searchRadius,
        setSearchRadius,
        searchQuery,
        setSearchQuery,
        campuses
    } = useApp();

    const [showCampusDropdown, setShowCampusDropdown] = useState(false);

    // Get nearby items (within selected radius)
    const nearbyItems = items
        .filter(item => item.distance <= searchRadius && item.status === 'available')
        .slice(0, 8);

    const stats = [
        { value: '2,500+', label: 'Active Students' },
        { value: '5,000+', label: 'Items Listed' },
        { value: '10,000+', label: 'Successful Rentals' },
        { value: '50+', label: 'Campuses' }
    ];

    const howItWorks = [
        {
            step: 1,
            icon: '📝',
            title: 'Sign Up',
            description: 'Create your account with your college email in just 2 minutes'
        },
        {
            step: 2,
            icon: '🔍',
            title: 'Browse Items',
            description: 'Find clothes and accessories from students within 200m of you'
        },
        {
            step: 3,
            icon: '🤝',
            title: 'Rent & Meet',
            description: 'Book your favorite item and pick it up from your neighbor'
        },
        {
            step: 4,
            icon: '⭐',
            title: 'Return & Review',
            description: 'Return on time and share your experience with the community'
        }
    ];

    const benefits = [
        {
            icon: <Sparkles className="benefit-icon" />,
            title: 'Fresh Styles Daily',
            description: 'Access hundreds of outfits without cluttering your closet'
        },
        {
            icon: <Users className="benefit-icon" />,
            title: 'Community First',
            description: 'Connect with fellow students who share your fashion sense'
        },
        {
            icon: <Leaf className="benefit-icon" />,
            title: 'Sustainable Fashion',
            description: 'Reduce waste and your carbon footprint by sharing clothes'
        },
        {
            icon: <Shield className="benefit-icon" />,
            title: 'Safe & Verified',
            description: 'Only verified college students, secure payments, and reviews'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="hero-content container">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Hyper-local fashion sharing</span>
                    </div>

                    <h1 className="hero-title">
                        Rent Fashion from
                        <span className="text-gradient"> Your Neighbors</span>
                    </h1>

                    <p className="hero-subtitle">
                        Discover thousands of clothing and accessories available within
                        <strong> 200 meters</strong> of your hostel. Save money, look amazing.
                    </p>

                    {/* Search Box */}
                    <div className="hero-search">
                        <div className="search-box">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={20} />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search for dresses, kurtas, accessories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="search-divider"></div>

                            <div className="campus-selector" onClick={() => setShowCampusDropdown(!showCampusDropdown)}>
                                <MapPin size={18} className="campus-icon" />
                                <span className="campus-name">{selectedCampus.shortName}</span>
                                <ChevronDown size={16} className={`campus-arrow ${showCampusDropdown ? 'open' : ''}`} />

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
                                                <span className="campus-option-name">{campus.name}</span>
                                                <span className="campus-option-city">{campus.city}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link to="/browse" className="search-button btn btn-primary btn-lg">
                                <span>Explore</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Radius Toggle */}
                        <div className="radius-toggle">
                            <span className="radius-label">Search radius:</span>
                            <div className="radius-options">
                                <button
                                    className={`radius-option ${searchRadius === 200 ? 'active' : ''}`}
                                    onClick={() => setSearchRadius(200)}
                                >
                                    200m
                                </button>
                                <button
                                    className={`radius-option ${searchRadius === 300 ? 'active' : ''}`}
                                    onClick={() => setSearchRadius(300)}
                                >
                                    300m
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="hero-stat">
                                <span className="hero-stat-value">{stat.value}</span>
                                <span className="hero-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="heading-2">Browse by Category</h2>
                        <p className="body-large">Find exactly what you're looking for</p>
                    </div>

                    <div className="categories-grid">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/browse?category=${category.id}`}
                                className="category-card"
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                                <span className="category-count">
                                    {items.filter(i => i.categoryId === category.id).length} items
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nearby Items Section */}
            <section className="section nearby-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="heading-2">Available Near You</h2>
                            <p className="body-large">
                                {nearbyItems.length} items within {searchRadius}m at {selectedCampus.shortName}
                            </p>
                        </div>
                        <Link to="/browse" className="btn btn-secondary">
                            View All
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="items-grid">
                        {nearbyItems.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section how-it-works-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="heading-2">How ClothShare Works</h2>
                        <p className="body-large">Start renting in 4 simple steps</p>
                    </div>

                    <div className="steps-grid">
                        {howItWorks.map((step, index) => (
                            <div key={step.step} className="step-card">
                                <div className="step-number">{step.step}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                                {index < howItWorks.length - 1 && (
                                    <ArrowRight className="step-arrow hide-mobile" size={24} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section benefits-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="heading-2">Why Students Love ClothShare</h2>
                        <p className="body-large">Join thousands of smart students</p>
                    </div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                {benefit.icon}
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2 className="heading-2">Ready to Start Sharing?</h2>
                            <p className="body-large">
                                Join ClothShare today and discover a new way to dress up.
                                It's free to sign up!
                            </p>
                            <div className="cta-actions">
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    Get Started Free
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/browse" className="btn btn-secondary btn-lg">
                                    Browse Items First
                                </Link>
                            </div>
                        </div>
                        <div className="cta-decoration">
                            <div className="cta-circle cta-circle-1"></div>
                            <div className="cta-circle cta-circle-2"></div>
                            <div className="cta-circle cta-circle-3"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
