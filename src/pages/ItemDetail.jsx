import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Heart,
    Share2,
    MapPin,
    Star,
    Calendar,
    MessageCircle,
    Shield,
    Clock,
    AlertCircle,
    CheckCircle,
    CreditCard,
    ShoppingCart,
    Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { itemsAPI, rentalsAPI } from '../api';
import { items as mockItems, getUserById, getReviewsByItemId } from '../data/mockData';
import PaymentButton from '../components/PaymentButton';
import './ItemDetail.css';

export default function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { savedItems, toggleSaveItem, isAuthenticated, currentUser, addToCart, cartItems } = useApp();
    const [addedToCart, setAddedToCart] = useState(false);

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rentLoading, setRentLoading] = useState(false);
    const [rentError, setRentError] = useState('');
    const [rentSuccess, setRentSuccess] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const isSaved = savedItems.includes(id);

    // Load item from API or mock data
    useEffect(() => {
        const loadItem = async () => {
            setLoading(true);
            try {
                // Try API first
                const data = await itemsAPI.getById(id);
                if (data.item) {
                    setItem({
                        ...data.item,
                        dailyPrice: data.item.daily_price,
                        securityDeposit: data.item.security_deposit || 200,
                        weeklyDiscount: data.item.weekly_discount || 0,
                        distance: Math.floor(Math.random() * 200) + 50,
                        rating: data.item.rating || 4.5,
                        reviewCount: data.item.review_count || 0,
                        images: data.item.images || ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
                        reviews: data.item.reviews || []
                    });
                }
            } catch (error) {
                // Fallback to mock data
                const mockItem = mockItems.find(i => i.id === id);
                if (mockItem) {
                    const owner = getUserById(mockItem.userId);
                    const reviews = getReviewsByItemId(mockItem.id);
                    setItem({ ...mockItem, owner, reviews });
                }
            }
            setLoading(false);
        };
        loadItem();
    }, [id]);

    if (loading) {
        return (
            <div className="item-detail-page">
                <div className="container">
                    <div className="loading-state">Loading item details...</div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="item-not-found container">
                <h2>Item not found</h2>
                <p>The item you're looking for doesn't exist or has been removed.</p>
                <Link to="/browse" className="btn btn-primary">Browse Items</Link>
            </div>
        );
    }

    const calculateTotal = () => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        if (days < 1) return null;

        const dailyPrice = item.dailyPrice || item.daily_price;
        let total = days * dailyPrice;
        if (days >= 7 && item.weeklyDiscount) {
            total = total * (1 - item.weeklyDiscount / 100);
        }
        return { days, total, deposit: item.securityDeposit || item.security_deposit || 200 };
    };

    const rental = calculateTotal();

    const handleRentRequest = async () => {
        console.log('handleRentRequest called', { isAuthenticated, startDate, endDate, rental });

        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to login');
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            setRentError('Please select start and end dates');
            return;
        }

        // Show payment instead of direct request
        console.log('Setting showPayment to true');
        setShowPayment(true);
        setRentError('');
    };

    const handlePaymentSuccess = async (paymentData) => {
        setRentLoading(true);
        setRentError('');
        setPaymentComplete(true);

        try {
            const result = await rentalsAPI.create({
                item_id: item.id,
                start_date: startDate,
                end_date: endDate,
                payment_id: paymentData.razorpay_payment_id,
                payment_status: 'paid',
                total_amount: rental ? Math.round(rental.total) + rental.deposit : 0
            });

            if (result.success) {
                setRentSuccess(true);
            }
        } catch (error) {
            setRentError(error.message || 'Failed to submit rental request');
        }

        setRentLoading(false);
    };

    const handlePaymentFailure = (error) => {
        setRentError(error.description || 'Payment failed. Please try again.');
        setShowPayment(false);
    };

    const images = item.images || ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'];

    return (
        <div className="item-detail-page">
            <div className="container">
                {/* Back Button */}
                <Link to="/browse" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Browse</span>
                </Link>

                <div className="item-detail-grid">
                    {/* Left Column - Images */}
                    <div className="item-images">
                        <div className="main-image">
                            <img
                                src={images[selectedImage]}
                                alt={item.title}
                            />
                            <button
                                className={`save-button ${isSaved ? 'saved' : ''}`}
                                onClick={() => toggleSaveItem(item.id)}
                            >
                                <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>
                            <button className="share-button">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {images.length > 1 && (
                            <div className="image-thumbnails">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${item.title} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="item-info">
                        <div className="item-header">
                            <h1 className="item-title">{item.title}</h1>
                            <div className="item-meta">
                                <span className="item-category">{item.subcategory || item.category}</span>
                                <span className="item-condition">{item.condition || item.item_condition || 'Good'}</span>
                                <div className="item-rating">
                                    <Star size={16} fill="currentColor" className="star-icon" />
                                    <span>{item.rating}</span>
                                    <span className="review-count">({item.reviewCount || 0} reviews)</span>
                                </div>
                            </div>
                            <div className="item-distance">
                                <MapPin size={16} />
                                <span>{item.distance}m away</span>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="pricing-card">
                            {rentSuccess ? (
                                <div className="rent-success">
                                    <CheckCircle size={48} />
                                    <h3>Request Submitted!</h3>
                                    <p>The owner will review your request and get back to you soon.</p>
                                    <Link to="/dashboard" className="btn btn-primary">
                                        View My Rentals
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="price-main">
                                        <span className="price-amount">₹{item.dailyPrice || item.daily_price}</span>
                                        <span className="price-period">/day</span>
                                    </div>
                                    {item.weeklyDiscount > 0 && (
                                        <p className="price-discount">
                                            {item.weeklyDiscount}% off for 7+ days
                                        </p>
                                    )}

                                    <div className="date-picker">
                                        <div className="date-input">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div className="date-input">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                min={startDate || new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    {rental && (
                                        <div className="rental-summary">
                                            <div className="summary-row">
                                                <span>₹{item.dailyPrice || item.daily_price} × {rental.days} days</span>
                                                <span>₹{rental.days * (item.dailyPrice || item.daily_price)}</span>
                                            </div>
                                            {item.weeklyDiscount > 0 && rental.days >= 7 && (
                                                <div className="summary-row discount">
                                                    <span>Weekly discount ({item.weeklyDiscount}%)</span>
                                                    <span>-₹{Math.round(rental.days * (item.dailyPrice || item.daily_price) * item.weeklyDiscount / 100)}</span>
                                                </div>
                                            )}
                                            <div className="summary-row">
                                                <span>Security deposit (refundable)</span>
                                                <span>₹{rental.deposit}</span>
                                            </div>
                                            <div className="summary-total">
                                                <span>Total</span>
                                                <span>₹{Math.round(rental.total) + rental.deposit}</span>
                                            </div>
                                        </div>
                                    )}

                                    {rentError && (
                                        <div className="rent-error">
                                            <AlertCircle size={16} />
                                            {rentError}
                                        </div>
                                    )}

                                    {showPayment && rental ? (
                                        <PaymentButton
                                            amount={Math.round(rental.total)}
                                            securityDeposit={rental.deposit}
                                            itemTitle={item.title}
                                            rentalDays={rental.days}
                                            userName={currentUser?.name}
                                            userEmail={currentUser?.email}
                                            userPhone={currentUser?.phone}
                                            rentalId={`${item.id}_${Date.now()}`}
                                            onPaymentSuccess={handlePaymentSuccess}
                                            onPaymentFailure={handlePaymentFailure}
                                            disabled={rentLoading || paymentComplete}
                                        />
                                    ) : (
                                        <div className="action-buttons">
                                            <button
                                                className={`btn btn-secondary btn-lg ${addedToCart ? 'added' : ''}`}
                                                onClick={() => {
                                                    if (!isAuthenticated) {
                                                        navigate('/login');
                                                        return;
                                                    }
                                                    if (!rental) {
                                                        setRentError('Please select rental dates first');
                                                        return;
                                                    }
                                                    addToCart(item, rental.days, startDate, endDate);
                                                    setAddedToCart(true);
                                                    setTimeout(() => setAddedToCart(false), 2000);
                                                }}
                                                disabled={!rental}
                                            >
                                                <ShoppingCart size={18} />
                                                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                                            </button>
                                            <button
                                                className={`btn btn-primary btn-lg ${rentLoading ? 'loading' : ''}`}
                                                onClick={handleRentRequest}
                                                disabled={rentLoading || !rental}
                                            >
                                                <Zap size={18} />
                                                {isAuthenticated ? 'Buy Now' : 'Log in to Rent'}
                                            </button>
                                        </div>
                                    )}

                                    <div className="trust-badges">
                                        <div className="trust-badge">
                                            <Shield size={16} />
                                            <span>Secure Payment</span>
                                        </div>
                                        <div className="trust-badge">
                                            <Clock size={16} />
                                            <span>24h Response</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Owner Card */}
                        {(item.owner || item.owner_name) && (
                            <div className="owner-card">
                                <div className="owner-info">
                                    <div className="avatar avatar-lg">
                                        {item.owner?.avatar || item.owner_avatar ? (
                                            <img src={item.owner?.avatar || item.owner_avatar} alt={item.owner?.name || item.owner_name} />
                                        ) : (
                                            (item.owner?.name || item.owner_name || 'O').charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="owner-name">{item.owner?.name || item.owner_name}</h4>
                                        <div className="owner-rating">
                                            <Star size={14} fill="currentColor" className="star-icon" />
                                            <span>{item.owner?.rating || item.owner_rating || 4.5}</span>
                                            <span className="rating-count">({item.owner?.reviewCount || item.owner_review_count || 0} reviews)</span>
                                        </div>
                                        <p className="owner-location">
                                            <MapPin size={14} />
                                            {item.owner?.building || item.owner_building || 'Campus'}
                                        </p>
                                    </div>
                                </div>
                                <button className="btn btn-secondary">
                                    <MessageCircle size={16} />
                                    Message
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Item Details */}
                <div className="item-details-section">
                    <div className="details-column">
                        <h3>Description</h3>
                        <p>{item.description || 'No description provided.'}</p>
                    </div>

                    <div className="details-column">
                        <h3>Details</h3>
                        <ul className="details-list">
                            <li><span>Size</span><span>{item.size || 'Not specified'}</span></li>
                            <li><span>Color</span><span>{item.color || 'Not specified'}</span></li>
                            <li><span>Brand</span><span>{item.brand || 'Not specified'}</span></li>
                            <li><span>Condition</span><span>{item.condition || item.item_condition || 'Good'}</span></li>
                            <li><span>Category</span><span>{item.subcategory || item.category || 'Not specified'}</span></li>
                        </ul>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h3>Reviews ({item.reviews?.length || 0})</h3>

                    {item.reviews && item.reviews.length > 0 ? (
                        <div className="reviews-list">
                            {item.reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <div className="avatar avatar-md">
                                            {review.userAvatar || review.reviewer_avatar ? (
                                                <img src={review.userAvatar || review.reviewer_avatar} alt={review.userName || review.reviewer_name} />
                                            ) : (
                                                (review.userName || review.reviewer_name || 'U').charAt(0)
                                            )}
                                        </div>
                                        <div className="review-meta">
                                            <span className="reviewer-name">{review.userName || review.reviewer_name}</span>
                                            <span className="review-date">{review.date || review.created_at}</span>
                                        </div>
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < review.rating ? 'currentColor' : 'none'}
                                                    className="star-icon"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-reviews">No reviews yet. Be the first to rent and review!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
