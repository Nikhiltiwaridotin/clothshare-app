import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { itemsAPI } from '../api';
import { categories, sizes, colors } from '../data/mockData';
import './ListItem.css';

export default function ListItem() {
    const navigate = useNavigate();
    const { isAuthenticated, refreshItems } = useApp();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        size: '',
        color: '',
        brand: '',
        condition: 'Like New',
        daily_price: '',
        security_deposit: '',
        weekly_discount: ''
    });
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrl = () => {
        if (imageUrls.length < 5) {
            setImageUrls([...imageUrls, '']);
        }
    };

    const removeImageUrl = (index) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const selectedCategory = categories.find(c => c.id === formData.category);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.title || !formData.daily_price) {
            setError('Title and daily price are required');
            setLoading(false);
            return;
        }

        try {
            const validImages = imageUrls.filter(url => url.trim() !== '');

            const itemData = {
                ...formData,
                daily_price: parseFloat(formData.daily_price),
                security_deposit: parseFloat(formData.security_deposit) || 0,
                weekly_discount: parseInt(formData.weekly_discount) || 0,
                images: validImages.length > 0 ? validImages : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
            };

            const result = await itemsAPI.create(itemData);

            if (result.success) {
                setSuccess(true);
                await refreshItems();
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Failed to list item. Please try again.');
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="list-item-page">
                <div className="container">
                    <div className="success-message">
                        <CheckCircle size={64} />
                        <h2>Item Listed Successfully!</h2>
                        <p>Your item is now available for others to rent.</p>
                        <Link to="/dashboard" className="btn btn-primary">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="list-item-page">
            <div className="container">
                <Link to="/dashboard" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </Link>

                <div className="list-item-header">
                    <h1>List a New Item</h1>
                    <p>Share your clothes with others and start earning</p>
                </div>

                <form onSubmit={handleSubmit} className="list-item-form">
                    {error && (
                        <div className="form-error">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <section className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label className="form-label" htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-input"
                                placeholder="e.g., Red Silk Lehenga with Gold Embroidery"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-input form-textarea"
                                placeholder="Describe your item in detail - material, occasions it's suitable for, any special care instructions..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                    </section>

                    {/* Category & Details */}
                    <section className="form-section">
                        <h2>Category & Details</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="form-input form-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="subcategory">Subcategory</label>
                                <select
                                    id="subcategory"
                                    name="subcategory"
                                    className="form-input form-select"
                                    value={formData.subcategory}
                                    onChange={handleChange}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Select subcategory</option>
                                    {selectedCategory?.subcategories.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="size">Size</label>
                                <select
                                    id="size"
                                    name="size"
                                    className="form-input form-select"
                                    value={formData.size}
                                    onChange={handleChange}
                                >
                                    <option value="">Select size</option>
                                    {sizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="color">Color</label>
                                <select
                                    id="color"
                                    name="color"
                                    className="form-input form-select"
                                    value={formData.color}
                                    onChange={handleChange}
                                >
                                    <option value="">Select color</option>
                                    {colors.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="brand">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    className="form-input"
                                    placeholder="e.g., Zara, H&M, Local boutique"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="condition">Condition</label>
                                <select
                                    id="condition"
                                    name="condition"
                                    className="form-input form-select"
                                    value={formData.condition}
                                    onChange={handleChange}
                                >
                                    <option value="New with tags">New with tags</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Images */}
                    <section className="form-section">
                        <h2>Images</h2>
                        <p className="form-hint">Add image URLs (up to 5). First image will be the cover.</p>

                        <div className="image-urls">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="image-url-input">
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://example.com/image.jpg"
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                    />
                                    {imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeImageUrl(index)}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {imageUrls.length < 5 && (
                                <button type="button" className="add-image-btn" onClick={addImageUrl}>
                                    <Plus size={16} />
                                    Add another image
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="form-section">
                        <h2>Pricing</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="daily_price">Daily Price (₹) *</label>
                                <input
                                    type="number"
                                    id="daily_price"
                                    name="daily_price"
                                    className="form-input"
                                    placeholder="e.g., 150"
                                    value={formData.daily_price}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="security_deposit">Security Deposit (₹)</label>
                                <input
                                    type="number"
                                    id="security_deposit"
                                    name="security_deposit"
                                    className="form-input"
                                    placeholder="e.g., 500"
                                    value={formData.security_deposit}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ maxWidth: '300px' }}>
                            <label className="form-label" htmlFor="weekly_discount">Weekly Discount (%)</label>
                            <input
                                type="number"
                                id="weekly_discount"
                                name="weekly_discount"
                                className="form-input"
                                placeholder="e.g., 15"
                                value={formData.weekly_discount}
                                onChange={handleChange}
                                min="0"
                                max="50"
                            />
                            <p className="form-hint">Discount for rentals of 7+ days</p>
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="form-actions">
                        <Link to="/dashboard" className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Listing Item...' : 'List Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
