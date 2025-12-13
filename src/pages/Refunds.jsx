import { Link } from 'react-router-dom';
import { RefreshCw, XCircle, Clock, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import './Legal.css';

export default function Refunds() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <RefreshCw className="legal-icon" size={48} />
                    <h1>Cancellation & Refunds</h1>
                    <p className="legal-updated">Last updated: December 14, 2025</p>
                </div>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2><XCircle size={24} /> Cancellation Policy</h2>
                        <p><strong>Before Rental Pickup:</strong></p>
                        <ul>
                            <li>Free cancellation up to 24 hours before the scheduled pickup</li>
                            <li>Cancellations within 24 hours may incur a 10% cancellation fee</li>
                            <li>No-shows will be charged 50% of the rental amount</li>
                        </ul>
                        <p><strong>After Rental Pickup:</strong></p>
                        <ul>
                            <li>Once you have picked up the item, cancellation is not possible</li>
                            <li>Early returns do not qualify for partial refunds</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><CreditCard size={24} /> Refund Policy</h2>
                        <p><strong>Eligible for Full Refund:</strong></p>
                        <ul>
                            <li>Item significantly different from listing description</li>
                            <li>Item not available at scheduled pickup time (lender's fault)</li>
                            <li>Cancellation made 24+ hours before pickup</li>
                        </ul>
                        <p><strong>Eligible for Partial Refund:</strong></p>
                        <ul>
                            <li>Minor issues with item condition (case-by-case basis)</li>
                            <li>Late cancellation (within 24 hours)</li>
                        </ul>
                        <p><strong>Not Eligible for Refund:</strong></p>
                        <ul>
                            <li>Change of mind after pickup</li>
                            <li>Damage caused by renter</li>
                            <li>Early returns</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><CheckCircle size={24} /> Security Deposit</h2>
                        <ul>
                            <li>Security deposits are fully refundable upon item return</li>
                            <li>Deposits are returned within 3-5 business days of return confirmation</li>
                            <li>Deductions may apply for damage or late returns</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><Clock size={24} /> Refund Timeline</h2>
                        <ul>
                            <li><strong>Processing:</strong> 1-2 business days</li>
                            <li><strong>Bank Credit:</strong> 5-7 business days (depends on bank)</li>
                            <li><strong>UPI/Wallet:</strong> Instant to 24 hours</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><AlertTriangle size={24} /> How to Request Refund</h2>
                        <ol>
                            <li>Contact us at <strong>payments@clothshare.com</strong></li>
                            <li>Include your rental ID and payment ID</li>
                            <li>Describe the issue clearly</li>
                            <li>We will review and respond within 48 hours</li>
                        </ol>
                    </section>
                </div>

                <div className="legal-footer">
                    <Link to="/" className="btn btn-secondary">← Back to Home</Link>
                    <Link to="/contact" className="btn btn-primary">Contact Support →</Link>
                </div>
            </div>
        </div>
    );
}
