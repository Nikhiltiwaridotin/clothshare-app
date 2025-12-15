import { useState } from 'react';
import { Store, DollarSign, Users, Truck, Check, Upload, Phone, Mail, MapPin } from 'lucide-react';
import './VendorRegistration.css';

export default function VendorRegistration() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        businessType: '',
        description: '',
        categories: [],
        terms: false
    });

    const [submitted, setSubmitted] = useState(false);

    const categories = [
        'Ethnic Elegance',
        'Fancy Dresses',
        'Indo-Western',
        'Rajputana Royalty',
        'Saree',
        'Bridal Wear',
        'Party Wear',
        'Casual Wear'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (category) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="vendor-page">
                <div className="vendor-success">
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h2>Application Submitted!</h2>
                    <p>Thank you for your interest in partnering with ClothShare. Our team will review your application and get back to you within 2-3 business days.</p>
                    <a href="/" className="btn btn-primary btn-lg">Back to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="vendor-page">
            {/* Hero Section */}
            <section className="vendor-hero">
                <div className="container">
                    <span className="vendor-badge">Partner With Us</span>
                    <h1 className="vendor-hero-title">Sell With ClothShare</h1>
                    <p className="vendor-hero-subtitle">
                        Join India's fastest growing fashion rental marketplace. List your collection and reach thousands of customers.
                    </p>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="vendor-benefits">
                <div className="container">
                    <h2 className="section-title">Why Partner With Us?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Users size={28} />
                            </div>
                            <h3>Reach More Customers</h3>
                            <p>Access our growing customer base of fashion-conscious individuals across India.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <DollarSign size={28} />
                            </div>
                            <h3>Increase Revenue</h3>
                            <p>Turn your idle inventory into a steady stream of rental income.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Store size={28} />
                            </div>
                            <h3>Easy Management</h3>
                            <p>Simple dashboard to manage your listings, bookings, and payments.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Truck size={28} />
                            </div>
                            <h3>Logistics Support</h3>
                            <p>We handle pickup, delivery, and dry cleaning for a seamless experience.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Form */}
            <section className="vendor-form-section">
                <div className="container">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2>Register as a Vendor</h2>
                            <p>Fill out the form below to start your partnership with ClothShare</p>
                        </div>

                        <form onSubmit={handleSubmit} className="vendor-form">
                            <div className="form-section">
                                <h3>Business Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="businessName">Business Name *</label>
                                        <input
                                            type="text"
                                            id="businessName"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your business name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ownerName">Owner Name *</label>
                                        <input
                                            type="text"
                                            id="ownerName"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <div className="input-icon">
                                            <Mail size={18} />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <div className="input-icon">
                                            <Phone size={18} />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Location</h3>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label htmlFor="address">Address *</label>
                                        <div className="input-icon">
                                            <MapPin size={18} />
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                placeholder="Street address"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="City"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="pincode">Pincode *</label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Business Details</h3>
                                <div className="form-group">
                                    <label htmlFor="businessType">Business Type *</label>
                                    <select
                                        id="businessType"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select business type</option>
                                        <option value="boutique">Fashion Boutique</option>
                                        <option value="designer">Independent Designer</option>
                                        <option value="retailer">Retail Store</option>
                                        <option value="individual">Individual Seller</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Categories You'll List *</label>
                                    <div className="categories-grid">
                                        {categories.map(category => (
                                            <label key={category} className="category-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categories.includes(category)}
                                                    onChange={() => handleCategoryChange(category)}
                                                />
                                                <span>{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Tell Us About Your Collection</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Describe your collection, specialties, and why you want to partner with ClothShare..."
                                    />
                                </div>
                            </div>

                            <div className="form-group terms-group">
                                <label className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        checked={formData.terms}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a></span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg submit-btn">
                                <Upload size={20} />
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
