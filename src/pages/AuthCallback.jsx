import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { authAPI } from '../api';
import './Auth.css';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Verifying your login...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the session from the URL hash
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    setStatus('error');
                    setMessage(error.message || 'Authentication failed');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                if (session) {
                    // Store the token
                    localStorage.setItem('clothshare_token', session.access_token);

                    // Ensure profile exists
                    await authAPI.ensureProfile?.(session.user);

                    // Get full user data
                    const userData = await authAPI.getMe();
                    localStorage.setItem('clothshare_user', JSON.stringify(userData.user));

                    setStatus('success');
                    setMessage('Login successful!');
                } else {
                    // No session found
                    setStatus('error');
                    setMessage('No session found. Please try logging in again.');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (err) {
                console.error('Callback processing error:', err);
                setStatus('error');
                setMessage('Something went wrong. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    {status === 'processing' && (
                        <>
                            <div className="auth-spinner"></div>
                            <h2 style={{ marginTop: '1.5rem', color: 'var(--text-primary)' }}>
                                {message}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Please wait...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="auth-success-icon">✓</div>
                            <h2 style={{ marginTop: '1.5rem', color: 'var(--success)' }}>
                                {message}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                                You're now logged in!
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => navigate('/set-password')}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 1.5rem' }}
                                >
                                    Set Password
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.75rem 1.5rem' }}
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="auth-error-icon">✕</div>
                            <h2 style={{ marginTop: '1.5rem', color: 'var(--error)' }}>
                                {message}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Redirecting to login...
                            </p>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .auth-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid var(--border);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    margin: 0 auto;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .auth-success-icon {
                    width: 60px;
                    height: 60px;
                    background: var(--success);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: white;
                    margin: 0 auto;
                    animation: scaleIn 0.3s ease-out;
                }

                .auth-error-icon {
                    width: 60px;
                    height: 60px;
                    background: var(--error);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: white;
                    margin: 0 auto;
                    animation: scaleIn 0.3s ease-out;
                }

                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
