import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from 'lucide-react';
import './Legal.css';

export default function PrivacyPolicy() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <Shield className="legal-icon" size={48} />
                    <h1>Privacy Policy</h1>
                    <p className="legal-updated">Last updated: December 14, 2024</p>
                </div>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2><Eye size={24} /> Information We Collect</h2>
                        <p>When you use ClothShare, we collect the following information:</p>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, phone number (optional), and campus location when you create an account.</li>
                            <li><strong>Profile Data:</strong> Information you provide in your profile, including your hostel/building details.</li>
                            <li><strong>Listing Information:</strong> Details about clothing items you list, including photos, descriptions, sizes, and pricing.</li>
                            <li><strong>Transaction Data:</strong> Information about rentals, including rental periods, payment details, and communication with other users.</li>
                            <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited, items viewed, and search queries.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><Database size={24} /> How We Use Your Information</h2>
                        <p>We use the collected information to:</p>
                        <ul>
                            <li>Provide and maintain the ClothShare platform</li>
                            <li>Facilitate clothing rentals between users</li>
                            <li>Process payments and transactions</li>
                            <li>Send you important updates about your listings and rentals</li>
                            <li>Improve our services and user experience</li>
                            <li>Ensure platform security and prevent fraud</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><UserCheck size={24} /> Information Sharing</h2>
                        <p>We share your information only in the following circumstances:</p>
                        <ul>
                            <li><strong>With Other Users:</strong> Your name, campus, and contact preferences are shared with users you transact with.</li>
                            <li><strong>Service Providers:</strong> We use trusted third-party services (like Supabase for authentication and data storage) to operate our platform.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                        </ul>
                        <p><strong>We never sell your personal information to third parties.</strong></p>
                    </section>

                    <section className="legal-section">
                        <h2><Lock size={24} /> Data Security</h2>
                        <p>We take data security seriously and implement industry-standard measures:</p>
                        <ul>
                            <li>All data is encrypted in transit using HTTPS</li>
                            <li>Passwords are securely hashed and never stored in plain text</li>
                            <li>Access to user data is restricted to authorized personnel only</li>
                            <li>Regular security audits and updates</li>
                            <li>Automatic session timeout after 30 minutes of inactivity</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><Globe size={24} /> Your Rights</h2>
                        <p>You have the following rights regarding your data:</p>
                        <ul>
                            <li><strong>Access:</strong> You can request a copy of your personal data</li>
                            <li><strong>Correction:</strong> You can update your profile information at any time</li>
                            <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
                            <li><strong>Opt-out:</strong> You can opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><Mail size={24} /> Contact Us</h2>
                        <p>If you have questions about this Privacy Policy or your data, please contact us at:</p>
                        <p><strong>Email:</strong> privacy@clothshare.com</p>
                    </section>
                </div>

                <div className="legal-footer">
                    <Link to="/" className="btn btn-secondary">← Back to Home</Link>
                    <Link to="/terms" className="btn btn-primary">View Terms of Service →</Link>
                </div>
            </div>
        </div>
    );
}
