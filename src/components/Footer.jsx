import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Phone, MapPin, Heart, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
        setEmail('');
    };

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer-newsletter">
                <div className="container">
                    <div className="newsletter-content">
                        <div className="newsletter-text">
                            <h3>Get Our Latest Updates</h3>
                            <p>Subscribe to our newsletter for exclusive offers and fashion tips</p>
                        </div>
                        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">
                                <Send size={18} />
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.png" alt="ClothShare" className="logo-image" />
                            <span className="logo-text">ClothShare</span>
                        </Link>
                        <p className="footer-tagline">
                            Rent the perfect outfit for every occasion. Sustainable fashion made accessible.
                        </p>
                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Rent Collection */}
                    <div className="footer-section">
                        <h4>Rent Collection</h4>
                        <ul>
                            <li><Link to="/rent-collection?category=ethnic">Ethnic Elegance</Link></li>
                            <li><Link to="/rent-collection?category=fancy">Fancy Dresses</Link></li>
                            <li><Link to="/rent-collection?category=indo-western">Indo-Western</Link></li>
                            <li><Link to="/rent-collection?category=rajputana">Rajputana Royalty</Link></li>
                            <li><Link to="/rent-collection?category=saree">Saree</Link></li>
                            <li><Link to="/lookbook">Lookbook</Link></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="footer-section">
                        <h4>Information</h4>
                        <ul>
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/sell-with-us">Sell With Us</Link></li>
                            <li><Link to="/refunds">Cancellation & Refund</Link></li>
                            <li><Link to="/shipping">Shipping & Delivery</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
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
                                <span>Lucknow, India</span>
                            </li>
                        </ul>
                        <Link to="/contact" className="btn btn-secondary btn-sm footer-contact-btn">
                            Book an Appointment
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>© {currentYear} ClothShare. All Rights Reserved. Made with <Heart size={14} fill="currentColor" className="heart-icon" /> in India</p>
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

