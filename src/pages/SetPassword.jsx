import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../api';
import './Auth.css';

export default function SetPassword() {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useApp();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if not authenticated
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authAPI.updatePassword(formData.password);
            setSuccess('Password set successfully! You can now log in with your email and password.');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to set password. Please try again.');
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
                        <h1 className="auth-title">Set Your Password</h1>
                        <p className="auth-subtitle">
                            Create a password to enable password-based login
                        </p>
                    </div>

                    {/* Info */}
                    <div className="auth-info">
                        <p>
                            Hi <strong>{currentUser?.name || currentUser?.email}</strong>!
                            You're currently logged in via magic link. Set a password to enable
                            traditional email/password login for future sessions.
                        </p>
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
                            <label className="form-label" htmlFor="password">New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter a password (min 6 characters)"
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

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="input-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                            disabled={loading || success}
                        >
                            {loading ? 'Setting password...' : success ? 'Password Set!' : 'Set Password'}
                            {!loading && !success && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Skip option */}
                    <p className="auth-footer">
                        <Link to="/dashboard">Skip for now →</Link>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-info {
                    background: var(--bg-secondary);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                .auth-info strong {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}
