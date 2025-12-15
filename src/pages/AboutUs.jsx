import { Check, Heart, Sparkles, Shield, Truck, Clock } from 'lucide-react';
import './AboutUs.css';

export default function AboutUs() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <span className="about-badge">About ClothShare</span>
                    <h1 className="about-hero-title">
                        Rent Your Look, <span className="text-accent">Own Your Moment</span>
                    </h1>
                    <p className="about-hero-subtitle">
                        Your trusted partner for the finest rental experience in traditional and modern fashion.
                        We bring you a seamless way to access stunning, high-quality attire without the commitment of ownership.
                    </p>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-section">
                <div className="container">
                    <h2 className="section-title">Why Choose ClothShare?</h2>
                    <p className="section-subtitle">
                        We are passionate about celebrating culture and elegance by bringing you access to stunning attire for every special occasion.
                    </p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Sparkles size={32} />
                            </div>
                            <h3>Latest Traditional Designs</h3>
                            <p>Stay ahead of fashion trends with our constantly updated collection of contemporary and traditional outfits.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Uncompromised Quality</h3>
                            <p>Each garment is meticulously curated and maintained to deliver a flawless experience.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Heart size={32} />
                            </div>
                            <h3>Convenience & Affordability</h3>
                            <p>Enjoy the luxury of high-end traditional wear at a fraction of the cost, with a simple online rental process.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Truck size={32} />
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Get your outfit delivered right to your doorstep with our reliable and quick shipping service.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Clock size={32} />
                            </div>
                            <h3>Flexible Rental Periods</h3>
                            <p>Choose rental durations that work for you, from single day events to extended occasions.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Check size={32} />
                            </div>
                            <h3>Easy Returns</h3>
                            <p>Hassle-free returns with prepaid shipping labels and no cleaning required.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="story-section">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>
                                ClothShare was born from a simple idea: everyone deserves to feel special at every occasion
                                without breaking the bank. We noticed how many beautiful outfits sit unused in closets after
                                just one wear, and we wanted to change that.
                            </p>
                            <p>
                                Founded by fashion enthusiasts and sustainability advocates, we've built a platform that
                                connects people with stunning outfits for their special moments. Whether it's a wedding,
                                festival, party, or any celebration, we've got you covered.
                            </p>
                            <p>
                                Today, we're proud to serve thousands of customers across India, helping them look their
                                best while making fashion more sustainable and accessible.
                            </p>
                        </div>
                        <div className="story-image">
                            <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop" alt="Traditional Fashion" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">5000+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Outfits Available</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Cities Served</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">4.8★</span>
                            <span className="stat-label">Customer Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <h2>Experience Tradition, Redefined</h2>
                    <p>Ready to find your perfect outfit? Browse our collection today.</p>
                    <div className="cta-buttons">
                        <a href="/browse" className="btn btn-primary btn-lg">Browse Collection</a>
                        <a href="/contact" className="btn btn-secondary btn-lg">Contact Us</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
