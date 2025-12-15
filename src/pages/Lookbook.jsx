import { useState } from 'react';
import { X } from 'lucide-react';
import './Lookbook.css';

const lookbookItems = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop',
        title: 'Bridal Elegance',
        category: 'Wedding'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
        title: 'Traditional Lehenga',
        category: 'Ethnic'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
        title: 'Indo-Western Fusion',
        category: 'Indo-Western'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
        title: 'Festival Special',
        category: 'Festive'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop',
        title: 'Party Glamour',
        category: 'Party'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop',
        title: 'Royal Rajputana',
        category: 'Ethnic'
    },
    {
        id: 7,
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop',
        title: 'Saree Collection',
        category: 'Saree'
    },
    {
        id: 8,
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop',
        title: 'Contemporary Style',
        category: 'Modern'
    },
    {
        id: 9,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
        title: 'Evening Elegance',
        category: 'Party'
    },
    {
        id: 10,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
        title: 'Designer Collection',
        category: 'Designer'
    },
    {
        id: 11,
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop',
        title: 'Engagement Special',
        category: 'Wedding'
    },
    {
        id: 12,
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=700&fit=crop',
        title: 'Reception Look',
        category: 'Wedding'
    }
];

const categories = ['All', 'Wedding', 'Ethnic', 'Indo-Western', 'Festive', 'Party', 'Saree', 'Modern', 'Designer'];

export default function Lookbook() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [lightboxImage, setLightboxImage] = useState(null);

    const filteredItems = selectedCategory === 'All'
        ? lookbookItems
        : lookbookItems.filter(item => item.category === selectedCategory);

    return (
        <div className="lookbook-page">
            {/* Hero Section */}
            <section className="lookbook-hero">
                <div className="container">
                    <span className="lookbook-badge">Style Inspiration</span>
                    <h1 className="lookbook-hero-title">Our Lookbook</h1>
                    <p className="lookbook-hero-subtitle">
                        Get inspired by our curated collection of stunning outfits for every occasion.
                    </p>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="lookbook-filters">
                <div className="container">
                    <div className="filter-tabs">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="lookbook-gallery">
                <div className="container">
                    <div className="gallery-grid">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="gallery-item"
                                onClick={() => setLightboxImage(item)}
                            >
                                <img src={item.image} alt={item.title} />
                                <div className="gallery-overlay">
                                    <span className="gallery-category">{item.category}</span>
                                    <h3>{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="lookbook-cta">
                <div className="container">
                    <h2>Love What You See?</h2>
                    <p>Browse our full collection and find your perfect outfit.</p>
                    <a href="/browse" className="btn btn-primary btn-lg">Shop Now</a>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="lightbox" onClick={() => setLightboxImage(null)}>
                    <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
                        <X size={28} />
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={lightboxImage.image} alt={lightboxImage.title} />
                        <div className="lightbox-info">
                            <span className="lightbox-category">{lightboxImage.category}</span>
                            <h3>{lightboxImage.title}</h3>
                            <a href="/browse" className="btn btn-primary">Rent This Look</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
