import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, Package, AlertTriangle } from 'lucide-react';
import './Legal.css';

export default function Shipping() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <Truck className="legal-icon" size={48} />
                    <h1>Shipping & Delivery</h1>
                    <p className="legal-updated">Last updated: December 14, 2025</p>
                </div>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2><Package size={24} /> How ClothShare Works</h2>
                        <p>ClothShare is a <strong>peer-to-peer clothing rental platform</strong> for college students. Unlike traditional e-commerce, we do not ship products.</p>
                        <p>All rentals are conducted through <strong>direct meetups</strong> between the lender (item owner) and renter (you) on campus.</p>
                    </section>

                    <section className="legal-section">
                        <h2><MapPin size={24} /> Pickup & Return</h2>
                        <ul>
                            <li><strong>Pickup:</strong> Arrange a meetup with the lender at a mutually convenient campus location</li>
                            <li><strong>Return:</strong> Return the item to the lender at the agreed location by the rental end date</li>
                            <li><strong>Locations:</strong> Common meetup spots include hostels, libraries, cafeterias, or campus gates</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><Clock size={24} /> Timing</h2>
                        <ul>
                            <li>Pickup and return times are arranged directly between lender and renter</li>
                            <li>We recommend confirming meetup details via the in-app messaging feature</li>
                            <li>Please be punctual to respect both parties' time</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><AlertTriangle size={24} /> Important Notes</h2>
                        <ul>
                            <li>ClothShare does not handle physical delivery of items</li>
                            <li>We do not charge any shipping or delivery fees</li>
                            <li>All transactions are local, within the same campus or nearby areas</li>
                            <li>For any issues with pickup/return, contact both the other user and our support team</li>
                        </ul>
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
