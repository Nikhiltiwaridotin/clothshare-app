import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, MapPin, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../api';
import { isSupabaseConfigured } from '../lib/supabase';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const { signup, campuses } = useApp();

    const [step, setStep] = useState(1);
    // Default to magic link
    const [signupMethod, setSignupMethod] = useState('magic');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        campus: 'AMITY Lucknow',
        building: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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

    const validateStep1 = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        if (signupMethod === 'password' && formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    // Handle Magic Link signup
    const handleMagicSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.email || !formData.name) {
            setError('Please enter your name and email');
            setLoading(false);
            return;
        }

        try {
            // First, send the magic link
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

    // Handle Password signup
    const handlePasswordSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            campus: formData.campus,
            building: formData.building
        });

        if (result.success) {
            if (result.needsConfirmation) {
                setSuccess('✅ Account created! Please check your email to confirm your account.');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }

        setLoading(false);
    };

    const handleSubmit = signupMethod === 'magic' ? handleMagicSignup : handlePasswordSignup;

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
                        <p className="auth-subtitle">
                            {step === 1 ? 'Create your account' : 'Set up your location'}
                        </p>
                    </div>

                    {/* Progress - only show for password signup */}
                    {signupMethod === 'password' && (
                        <div className="signup-progress">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                                <span className="progress-number">1</span>
                                <span className="progress-label">Account</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                                <span className="progress-number">2</span>
                                <span className="progress-label">Location</span>
                            </div>
                        </div>
                    )}

                    {/* Signup Method Toggle */}
                    {step === 1 && (
                        <div className="login-method-toggle">
                            <button
                                type="button"
                                className={`method-btn ${signupMethod === 'magic' ? 'active' : ''}`}
                                onClick={() => setSignupMethod('magic')}
                            >
                                <Sparkles size={16} />
                                Magic Link
                            </button>
                            <button
                                type="button"
                                className={`method-btn ${signupMethod === 'password' ? 'active' : ''}`}
                                onClick={() => setSignupMethod('password')}
                            >
                                <Lock size={16} />
                                Password
                            </button>
                        </div>
                    )}

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

                        {step === 1 && (
                            <>
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
                                    {signupMethod === 'magic' && (
                                        <p className="form-hint">We'll send you a magic link - no password needed!</p>
                                    )}
                                </div>

                                {signupMethod === 'password' && (
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                className="form-input"
                                                placeholder="Create a password (min 6 characters)"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                className="input-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Optional fields for magic signup */}
                                {signupMethod === 'magic' && (
                                    <>
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
                                    </>
                                )}

                                {signupMethod === 'magic' ? (
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                                        disabled={loading || success}
                                    >
                                        {loading ? 'Sending link...' : success ? 'Check your email!' : 'Send Magic Link'}
                                        {!loading && !success && <Sparkles size={18} />}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg w-full"
                                        onClick={handleNext}
                                    >
                                        Continue
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </>
                        )}

                        {step === 2 && signupMethod === 'password' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="phone">Phone Number (Optional)</label>
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
                                    <label className="form-label" htmlFor="campus">Campus/College</label>
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

                                <div className="form-group">
                                    <label className="form-label" htmlFor="building">Hostel/Building (Optional)</label>
                                    <div className="input-wrapper">
                                        <MapPin className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            id="building"
                                            name="building"
                                            className="form-input"
                                            placeholder="e.g., Hostel A, Block 3"
                                            value={formData.building}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg flex-1 ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating account...' : 'Create Account'}
                                        {!loading && <ArrowRight size={18} />}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    {step === 1 && signupMethod === 'password' && (
                        <>
                            {/* Divider */}
                            <div className="auth-divider">
                                <span>or continue with</span>
                            </div>

                            {/* Social Login */}
                            <div className="social-buttons">
                                <button className="btn btn-secondary social-btn" type="button">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Google</span>
                                </button>
                                <button className="btn btn-secondary social-btn" type="button">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span>Facebook</span>
                                </button>
                            </div>
                        </>
                    )}

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
                .login-method-toggle {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0.25rem;
                    background: var(--bg-secondary);
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                }

                .method-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    font-weight: 500;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .method-btn:hover {
                    color: var(--text-primary);
                }

                .method-btn.active {
                    background: var(--bg-primary);
                    color: var(--primary);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
