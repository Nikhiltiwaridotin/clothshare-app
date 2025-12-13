import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, Phone, MapPin, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../api';
import './Auth.css';

export default function Signup() {
    const { campuses } = useApp();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        campus: 'AMITY Lucknow',
        building: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.name.trim()) {
            setError('Please enter your name');
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email');
            setLoading(false);
            return;
        }

        try {
            await authAPI.sendOTP(formData.email);
            setSuccess('✨ Check your email! Click the magic link to complete signup. Your profile info will be saved when you log in.');

            // Store profile data temporarily for when they click the link
            localStorage.setItem('clothshare_pending_profile', JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                campus: formData.campus,
                building: formData.building
            }));
        } catch (err) {
            setError(err.message || 'Failed to send magic link. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <span className="logo-icon">👔👗</span>
                            <span className="logo-text">ClothShare</span>
                        </Link>
                        <h1 className="auth-title">Join ClothShare</h1>
                        <p className="auth-subtitle">Create your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="auth-success">
                                <CheckCircle size={16} />
                                {success}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <p className="form-hint">We'll send you a magic link - no password needed!</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone (Optional)</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={18} />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="campus">Campus</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <select
                                    id="campus"
                                    name="campus"
                                    className="form-input form-select"
                                    value={formData.campus}
                                    onChange={handleChange}
                                >
                                    {campuses.map(campus => (
                                        <option key={campus.id} value={campus.name}>
                                            {campus.name} - {campus.city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                            disabled={loading || success}
                        >
                            {loading ? 'Sending link...' : success ? 'Check your email!' : 'Send Magic Link'}
                            {!loading && !success && <Sparkles size={18} />}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>

                    {/* Terms */}
                    <p className="auth-terms">
                        By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-success {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 12px;
                    color: var(--success);
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin-bottom: 1rem;
                }

                .auth-success svg {
                    flex-shrink: 0;
                    margin-top: 2px;
                }
            `}</style>
        </div>
    );
}
