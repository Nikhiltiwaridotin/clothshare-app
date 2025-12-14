import { useState, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    AlertCircle,
    CheckCircle,
    Image as ImageIcon,
    Loader
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { itemsAPI } from '../api';
import { categories, sizes, colors } from '../data/mockData';
import { uploadItemImage } from '../lib/supabase';
import './ListItem.css';

export default function ListItem() {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser, refreshItems } = useApp();
    const fileInputRef = useRef(null);

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
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
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

    // Handle file selection
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addFiles(files);
    };

    // Add files to the upload list
    const addFiles = (files) => {
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                setError('Please select only image files');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image must be less than 5MB');
                return false;
            }
            return true;
        });

        const totalFiles = uploadedFiles.length + validFiles.length;
        if (totalFiles > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        // Create preview URLs
        const filesWithPreviews = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setUploadedFiles(prev => [...prev, ...filesWithPreviews]);
        setError('');
    };

    // Remove uploaded file
    const removeFile = (index) => {
        setUploadedFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
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
            let allImageUrls = [];

            // Upload files to Supabase Storage
            if (uploadedFiles.length > 0) {
                setUploadingImages(true);
                try {
                    const userId = currentUser?.id || 'anonymous';
                    const uploadPromises = uploadedFiles.map(({ file }) =>
                        uploadItemImage(file, userId)
                    );
                    const uploadedUrls = await Promise.all(uploadPromises);
                    allImageUrls = [...uploadedUrls];
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    // Continue with URL images if upload fails
                    setError('Image upload failed, but continuing with URL images if any...');
                }
                setUploadingImages(false);
            }

            // Add manually entered image URLs
            const validUrlImages = imageUrls.filter(url => url.trim() !== '');
            allImageUrls = [...allImageUrls, ...validUrlImages];

            // Use default image if no images provided
            if (allImageUrls.length === 0) {
                allImageUrls = ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'];
            }

            const itemData = {
                ...formData,
                daily_price: parseFloat(formData.daily_price),
                security_deposit: parseFloat(formData.security_deposit) || 0,
                weekly_discount: parseInt(formData.weekly_discount) || 0,
                images: allImageUrls
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
            console.error('List item error:', err);
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
                        <p className="form-hint">Upload photos of your item (up to 5). First image will be the cover.</p>

                        {/* File Upload Area */}
                        <div
                            className="image-upload-area"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                            />
                            <Upload size={40} className="upload-icon" />
                            <p className="upload-text">
                                <strong>Click to upload</strong> or drag and drop
                            </p>
                            <p className="upload-hint">PNG, JPG up to 5MB (max 5 images)</p>
                        </div>

                        {/* Image Previews */}
                        {uploadedFiles.length > 0 && (
                            <div className="image-previews">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={file.preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-preview-btn"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X size={16} />
                                        </button>
                                        {index === 0 && <span className="cover-badge">Cover</span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* OR Divider */}
                        <div className="or-divider">
                            <span>OR add image URLs</span>
                        </div>

                        {/* Image URLs Section */}
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
                                    Add another URL
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
