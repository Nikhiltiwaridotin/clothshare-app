import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">👔👗</span>
                            <span className="logo-text">ClothShare</span>
                        </Link>
                        <p className="footer-tagline">
                            Rent clothes from your campus neighbors. Sustainable fashion for college students.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/browse">Browse Items</Link></li>
                            <li><Link to="/list-item">List Your Clothes</Link></li>
                            <li><Link to="/how-it-works">How It Works</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Policy */}
                    <div className="footer-section">
                        <h4>Legal & Policy</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/refunds">Cancellation & Refunds</Link></li>
                            <li><Link to="/shipping">Shipping & Delivery</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <ul className="contact-list">
                            <li>
                                <Mail size={16} />
                                <a href="mailto:support@clothshare.com">support@clothshare.com</a>
                            </li>
                            <li>
                                <Phone size={16} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li>
                                <MapPin size={16} />
                                <span>Amity University, Lucknow</span>
                            </li>
                        </ul>
                        <Link to="/contact" className="btn btn-secondary btn-sm footer-contact-btn">
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>© {currentYear} ClothShare. Made with <Heart size={14} fill="currentColor" className="heart-icon" /> for college students.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
