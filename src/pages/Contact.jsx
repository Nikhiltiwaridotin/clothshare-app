import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import './Legal.css';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, send to backend
        setSubmitted(true);
    };

    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <MessageSquare className="legal-icon" size={48} />
                    <h1>Contact Us</h1>
                    <p className="legal-updated">We'd love to hear from you</p>
                </div>

                <div className="legal-content">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <section className="legal-section">
                                <h2><Mail size={24} /> Email Us</h2>
                                <p><strong>General Inquiries:</strong> support@clothshare.com</p>
                                <p><strong>Payment Issues:</strong> payments@clothshare.com</p>
                                <p><strong>Business:</strong> business@clothshare.com</p>
                            </section>

                            <section className="legal-section">
                                <h2><Phone size={24} /> Call Us</h2>
                                <p><strong>Customer Support:</strong> +91 98765 43210</p>
                                <p><strong>Business Hours:</strong> Mon-Sat, 10 AM - 6 PM IST</p>
                            </section>

                            <section className="legal-section">
                                <h2><MapPin size={24} /> Our Address</h2>
                                <p>ClothShare India Pvt. Ltd.</p>
                                <p>Amity University Campus</p>
                                <p>Lucknow, Uttar Pradesh 226028</p>
                                <p>India</p>
                            </section>

                            <section className="legal-section">
                                <h2><Clock size={24} /> Response Time</h2>
                                <p>We typically respond within 24-48 hours.</p>
                                <p>For urgent payment issues, please call us directly.</p>
                            </section>
                        </div>

                        <div className="contact-form-container">
                            {submitted ? (
                                <div className="form-success">
                                    <Send size={48} />
                                    <h3>Message Sent!</h3>
                                    <p>We'll get back to you within 24-48 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <h3>Send us a Message</h3>
                                    <input type="text" placeholder="Your Name" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input type="email" placeholder="Your Email" required
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    <input type="text" placeholder="Subject" required
                                        value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                    <textarea placeholder="Your Message" rows={5} required
                                        value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                    <button type="submit" className="btn btn-primary w-full">
                                        <Send size={18} /> Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                <div className="legal-footer">
                    <Link to="/" className="btn btn-secondary">← Back to Home</Link>
                </div>
            </div>

            <style>{`
                .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .contact-form { display: flex; flex-direction: column; gap: 1rem; }
                .contact-form h3 { margin-bottom: 0.5rem; }
                .contact-form input, .contact-form textarea {
                    padding: 0.875rem 1rem; border: 1px solid var(--border);
                    border-radius: 8px; font-size: 1rem; background: var(--bg-primary);
                }
                .contact-form textarea { resize: vertical; }
                .form-success { text-align: center; padding: 3rem; }
                .form-success svg { color: var(--success); margin-bottom: 1rem; }
                .form-success h3 { color: var(--success); }
                @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
