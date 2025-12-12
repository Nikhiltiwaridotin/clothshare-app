import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
    Plus,
    Package,
    Clock,
    History,
    Settings,
    Star,
    MapPin,
    Eye,
    Heart,
    Edit,
    Pause,
    ArrowRight,
    Check,
    X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { itemsAPI, rentalsAPI } from '../api';
import './Dashboard.css';

export default function Dashboard() {
    const { currentUser, isAuthenticated, campuses } = useApp();
    const [myItems, setMyItems] = useState([]);
    const [myRentals, setMyRentals] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('listings');

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load my items
            const itemsData = await itemsAPI.getMyItems();
            if (itemsData.items) {
                setMyItems(itemsData.items);
            }

            // Load my rentals
            const rentalsData = await rentalsAPI.getMyRentals();
            if (rentalsData.rentals) {
                setMyRentals(rentalsData.rentals);
            }

            // Load rental requests for my items
            const requestsData = await rentalsAPI.getRequests();
            if (requestsData.rentals) {
                setRequests(requestsData.rentals);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        setLoading(false);
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await rentalsAPI.accept(requestId);
            loadData(); // Refresh data
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rentalsAPI.reject(requestId);
            loadData(); // Refresh data
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const campus = campuses.find(c => c.name === currentUser?.campus);
    const pendingRequests = requests.filter(r => r.status === 'pending');

    const stats = [
        { label: 'Items Listed', value: myItems.length, icon: <Package size={20} /> },
        { label: 'Active Rentals', value: myRentals.filter(r => r.status === 'confirmed').length, icon: <Clock size={20} /> },
        { label: 'Pending Requests', value: pendingRequests.length, icon: <History size={20} /> },
        { label: 'Rating', value: currentUser?.rating || '5.0', icon: <Star size={20} /> }
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="user-profile">
                        <div className="avatar avatar-xl">
                            {currentUser?.avatar ? (
                                <img src={currentUser.avatar} alt={currentUser.name} />
                            ) : (
                                currentUser?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <div className="user-info">
                            <h1 className="user-name">Welcome, {currentUser?.name?.split(' ')[0]}! 👋</h1>
                            <p className="user-location">
                                <MapPin size={16} />
                                {campus?.shortName || currentUser?.campus || 'Campus'} · {currentUser?.building || 'Building'}
                            </p>
                            <div className="user-rating">
                                <Star size={16} fill="currentColor" className="star-icon" />
                                <span>{currentUser?.rating || '5.0'}</span>
                                <span className="rating-count">({currentUser?.review_count || 0} reviews)</span>
                            </div>
                        </div>
                    </div>
                    <Link to="/list-item" className="btn btn-primary btn-lg">
                        <Plus size={18} />
                        List New Item
                    </Link>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('listings')}
                    >
                        My Listings ({myItems.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'rentals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rentals')}
                    >
                        My Rentals ({myRentals.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Requests ({pendingRequests.length})
                        {pendingRequests.length > 0 && <span className="tab-badge">{pendingRequests.length}</span>}
                    </button>
                </div>

                {/* Content */}
                <div className="dashboard-content">
                    {loading ? (
                        <div className="loading-state">Loading...</div>
                    ) : (
                        <>
                            {/* My Listings Tab */}
                            {activeTab === 'listings' && (
                                <section className="dashboard-section">
                                    {myItems.length > 0 ? (
                                        <div className="listings-list">
                                            {myItems.map(item => (
                                                <div key={item.id} className="listing-card">
                                                    <div className="listing-image">
                                                        <img
                                                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
                                                            alt={item.title}
                                                        />
                                                    </div>
                                                    <div className="listing-info">
                                                        <h3 className="listing-title">{item.title}</h3>
                                                        <div className="listing-meta">
                                                            <span className="listing-category">{item.subcategory || item.category}</span>
                                                            <span className="listing-size">Size {item.size}</span>
                                                        </div>
                                                        <div className="listing-stats">
                                                            <span><Eye size={14} /> {item.view_count || 0}</span>
                                                            <span><Heart size={14} /> {item.save_count || 0}</span>
                                                        </div>
                                                    </div>
                                                    <div className="listing-actions">
                                                        <span className={`listing-status ${item.status}`}>
                                                            {item.status === 'available' ? 'Available' : item.status}
                                                        </span>
                                                        <div className="listing-price">
                                                            <span className="price">₹{item.daily_price}</span>
                                                            <span className="period">/day</span>
                                                        </div>
                                                        <div className="listing-buttons">
                                                            <Link to={`/item/${item.id}`} className="btn btn-ghost btn-sm">
                                                                <Eye size={14} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <Package size={48} />
                                            <h3>No listings yet</h3>
                                            <p>Start earning by listing your first item!</p>
                                            <Link to="/list-item" className="btn btn-primary">
                                                <Plus size={16} />
                                                List an Item
                                            </Link>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* My Rentals Tab */}
                            {activeTab === 'rentals' && (
                                <section className="dashboard-section">
                                    {myRentals.length > 0 ? (
                                        <div className="rentals-list">
                                            {myRentals.map(rental => (
                                                <div key={rental.id} className="rental-card">
                                                    <div className="rental-image">
                                                        <img
                                                            src={rental.item_images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
                                                            alt={rental.item_title}
                                                        />
                                                    </div>
                                                    <div className="rental-info">
                                                        <h3 className="rental-title">{rental.item_title}</h3>
                                                        <p className="rental-owner">from {rental.owner_name}</p>
                                                        <div className="rental-dates">
                                                            <Clock size={14} />
                                                            {rental.start_date} - {rental.end_date}
                                                        </div>
                                                    </div>
                                                    <div className="rental-status-col">
                                                        <span className={`rental-status ${rental.status}`}>
                                                            {rental.status}
                                                        </span>
                                                        <span className="rental-total">₹{rental.total_amount}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <Clock size={48} />
                                            <h3>No rentals yet</h3>
                                            <p>Browse items and start renting!</p>
                                            <Link to="/browse" className="btn btn-primary">
                                                Browse Items
                                            </Link>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Requests Tab */}
                            {activeTab === 'requests' && (
                                <section className="dashboard-section">
                                    {requests.length > 0 ? (
                                        <div className="requests-list">
                                            {requests.map(request => (
                                                <div key={request.id} className="request-card">
                                                    <div className="request-image">
                                                        <img
                                                            src={request.item_images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
                                                            alt={request.item_title}
                                                        />
                                                    </div>
                                                    <div className="request-info">
                                                        <h3 className="request-title">{request.item_title}</h3>
                                                        <p className="request-renter">
                                                            Request from <strong>{request.renter_name}</strong>
                                                        </p>
                                                        <div className="request-details">
                                                            <span>{request.start_date} - {request.end_date}</span>
                                                            <span>{request.total_days} days</span>
                                                            <span>₹{request.total_amount}</span>
                                                        </div>
                                                    </div>
                                                    <div className="request-actions">
                                                        {request.status === 'pending' ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleAcceptRequest(request.id)}
                                                                >
                                                                    <Check size={14} />
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => handleRejectRequest(request.id)}
                                                                >
                                                                    <X size={14} />
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className={`request-status ${request.status}`}>
                                                                {request.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <History size={48} />
                                            <h3>No requests</h3>
                                            <p>When someone wants to rent your items, they'll appear here</p>
                                        </div>
                                    )}
                                </section>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <section className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/list-item" className="action-card">
                            <Plus size={24} />
                            <span>List Item</span>
                        </Link>
                        <Link to="/browse" className="action-card">
                            <Package size={24} />
                            <span>Browse</span>
                        </Link>
                        <Link to="/profile" className="action-card">
                            <Settings size={24} />
                            <span>Settings</span>
                        </Link>
                        <Link to="/faq" className="action-card">
                            <History size={24} />
                            <span>Help</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
