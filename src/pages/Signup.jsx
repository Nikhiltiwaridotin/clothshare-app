import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, Phone, MapPin, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../api';
import { supabase } from '../lib/supabase';
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
    const [socialLoading, setSocialLoading] = useState('');

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

    const handleGoogleSignup = async () => {
        setSocialLoading('google');
        setError('');
        try {
            // Store pending profile data
            localStorage.setItem('clothshare_pending_profile', JSON.stringify({
                name: formData.name || '',
                phone: formData.phone || '',
                campus: formData.campus || 'AMITY Lucknow',
                building: formData.building || ''
            }));

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message || 'Failed to signup with Google');
            setSocialLoading('');
        }
    };

    const handleGitHubSignup = async () => {
        setSocialLoading('github');
        setError('');
        try {
            // Store pending profile data
            localStorage.setItem('clothshare_pending_profile', JSON.stringify({
                name: formData.name || '',
                phone: formData.phone || '',
                campus: formData.campus || 'AMITY Lucknow',
                building: formData.building || ''
            }));

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message || 'Failed to signup with GitHub');
            setSocialLoading('');
        }
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

                    {/* Social Login */}
                    <div className="social-login-section">
                        <button
                            className={`btn btn-secondary social-btn w-full ${socialLoading === 'google' ? 'loading' : ''}`}
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={!!socialLoading || loading}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>{socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
                        </button>

                        <button
                            className={`btn btn-secondary social-btn w-full ${socialLoading === 'github' ? 'loading' : ''}`}
                            type="button"
                            onClick={handleGitHubSignup}
                            disabled={!!socialLoading || loading}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <span>{socialLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>or sign up with email</span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
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
                            disabled={loading || success || !!socialLoading}
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
                .social-login-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 500;
                }

                .social-btn svg {
                    flex-shrink: 0;
                }

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
