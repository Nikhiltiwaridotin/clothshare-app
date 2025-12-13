import { Link } from 'react-router-dom';
import { FileText, Users, ShoppingBag, AlertTriangle, Scale, Ban, RefreshCw, Gavel } from 'lucide-react';
import './Legal.css';

export default function Terms() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <FileText className="legal-icon" size={48} />
                    <h1>Terms of Service</h1>
                    <p className="legal-updated">Last updated: December 14, 2025</p>
                </div>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2><Users size={24} /> Acceptance of Terms</h2>
                        <p>By accessing or using ClothShare, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                        <p>ClothShare is a peer-to-peer clothing rental platform designed for college students. By using our services, you confirm that you are at least 18 years old or have parental consent.</p>
                    </section>

                    <section className="legal-section">
                        <h2><ShoppingBag size={24} /> User Responsibilities</h2>
                        <p><strong>As a Lender (Item Owner):</strong></p>
                        <ul>
                            <li>You must only list items that you legally own and have the right to rent</li>
                            <li>Items must be accurately described, clean, and in good condition</li>
                            <li>You must respond to rental requests in a timely manner</li>
                            <li>You are responsible for meeting renters at agreed times and locations</li>
                            <li>You must set fair and accurate pricing for your items</li>
                        </ul>
                        <p><strong>As a Renter:</strong></p>
                        <ul>
                            <li>You must treat rented items with care and return them in the same condition</li>
                            <li>Items must be returned by the agreed-upon date</li>
                            <li>You are responsible for any damage or loss during the rental period</li>
                            <li>You must not sublease or lend rented items to others</li>
                            <li>Payment must be made as agreed before or upon receiving items</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><AlertTriangle size={24} /> Liability & Disputes</h2>
                        <p>ClothShare acts as a platform connecting lenders and renters. We are not responsible for:</p>
                        <ul>
                            <li>The quality, safety, or legality of listed items</li>
                            <li>The accuracy of item descriptions or photos</li>
                            <li>Transactions conducted outside our platform</li>
                            <li>Damage, loss, or theft of items during rentals</li>
                            <li>User disputes or disagreements</li>
                        </ul>
                        <p>Users are encouraged to resolve disputes directly. ClothShare may, at its discretion, assist in mediating disputes but is not obligated to do so.</p>
                    </section>

                    <section className="legal-section">
                        <h2><Scale size={24} /> Payments & Fees</h2>
                        <ul>
                            <li>Rental prices are set by lenders</li>
                            <li>ClothShare may charge a service fee for facilitating transactions</li>
                            <li>All payments should be processed through approved payment methods</li>
                            <li>Refunds are subject to our refund policy and mutual agreement between parties</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><Ban size={24} /> Prohibited Activities</h2>
                        <p>The following activities are strictly prohibited on ClothShare:</p>
                        <ul>
                            <li>Creating fake accounts or impersonating others</li>
                            <li>Listing stolen, counterfeit, or illegal items</li>
                            <li>Harassment or abusive behavior towards other users</li>
                            <li>Manipulation of reviews or ratings</li>
                            <li>Circumventing our platform to avoid fees</li>
                            <li>Spamming or posting irrelevant content</li>
                            <li>Any activity that violates local, state, or national laws</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><RefreshCw size={24} /> Account Termination</h2>
                        <p>ClothShare reserves the right to suspend or terminate accounts that:</p>
                        <ul>
                            <li>Violate these Terms of Service</li>
                            <li>Engage in fraudulent or harmful activities</li>
                            <li>Receive repeated complaints from other users</li>
                            <li>Remain inactive for extended periods</li>
                        </ul>
                        <p>You may delete your account at any time through your account settings.</p>
                    </section>

                    <section className="legal-section">
                        <h2><Gavel size={24} /> Governing Law</h2>
                        <p>These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh.</p>
                    </section>
                </div>

                <div className="legal-footer">
                    <Link to="/" className="btn btn-secondary">← Back to Home</Link>
                    <Link to="/privacy" className="btn btn-primary">View Privacy Policy →</Link>
                </div>
            </div>
        </div>
    );
}
