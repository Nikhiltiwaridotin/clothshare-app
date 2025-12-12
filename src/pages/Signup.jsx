import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const { signup, campuses } = useApp();

    const [step, setStep] = useState(1);
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
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
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
        if (formData.password.length < 6) {
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

    const handleSubmit = async (e) => {
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
            navigate('/dashboard');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
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
                        <p className="auth-subtitle">
                            {step === 1 ? 'Create your account' : 'Set up your location'}
                        </p>
                    </div>

                    {/* Progress */}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                <AlertCircle size={16} />
                                {error}
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
                                    <p className="form-hint">You can use any email address</p>
                                </div>

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

                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg w-full"
                                    onClick={handleNext}
                                >
                                    Continue
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        )}

                        {step === 2 && (
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

                    {step === 1 && (
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
        </div>
    );
}
