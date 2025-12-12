import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserById } from '../data/mockData';
import './ItemCard.css';

export default function ItemCard({ item }) {
    const { savedItems, toggleSaveItem, isAuthenticated } = useApp();
    const isSaved = savedItems.includes(item.id);
    const owner = getUserById(item.userId);

    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            toggleSaveItem(item.id);
        }
    };

    return (
        <Link to={`/item/${item.id}`} className="item-card">
            <div className="item-card-image-wrapper">
                <img
                    src={item.images[0]}
                    alt={item.title}
                    className="item-card-image"
                    loading="lazy"
                />
                <button
                    className={`item-card-save ${isSaved ? 'saved' : ''}`}
                    onClick={handleSaveClick}
                    title={isSaved ? 'Remove from saved' : 'Save item'}
                >
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
                <div className="item-card-distance">
                    <MapPin size={12} />
                    <span>{item.distance}m</span>
                </div>
                {item.status !== 'available' && (
                    <div className="item-card-status">
                        {item.status === 'rented' ? 'Rented' : 'Unavailable'}
                    </div>
                )}
            </div>

            <div className="item-card-content">
                <h3 className="item-card-title">{item.title}</h3>

                <div className="item-card-meta">
                    <span className="item-card-category">{item.subcategory}</span>
                    <span className="item-card-size">Size {item.size}</span>
                </div>

                <div className="item-card-footer">
                    <div className="item-card-price">
                        <span className="price-amount">₹{item.dailyPrice}</span>
                        <span className="price-period">/day</span>
                    </div>

                    <div className="item-card-rating">
                        <Star size={14} className="rating-star" fill="currentColor" />
                        <span>{item.rating}</span>
                        <span className="rating-count">({item.reviewCount})</span>
                    </div>
                </div>

                {owner && (
                    <div className="item-card-owner">
                        <div className="avatar avatar-sm">
                            {owner.avatar ? (
                                <img src={owner.avatar} alt={owner.name} />
                            ) : (
                                owner.name.charAt(0)
                            )}
                        </div>
                        <span>{owner.name.split(' ')[0]}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
