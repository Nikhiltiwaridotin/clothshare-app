import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Mail, MessageCircle } from 'lucide-react';
import { faqs } from '../data/mockData';
import './FAQ.css';

export default function FAQ() {
    const [openItems, setOpenItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const toggleItem = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category =>
        (!selectedCategory || category.category === selectedCategory) &&
        category.questions.length > 0
    );

    return (
        <div className="faq-page">
            <div className="container">
                {/* Header */}
                <div className="faq-header">
                    <h1 className="heading-2">How can we help you?</h1>
                    <p className="body-large">
                        Find answers to frequently asked questions about ClothShare
                    </p>

                    {/* Search */}
                    <div className="faq-search">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="faq-search-input"
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="category-pills">
                        <button
                            className={`category-pill ${!selectedCategory ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All
                        </button>
                        {faqs.map(category => (
                            <button
                                key={category.category}
                                className={`category-pill ${selectedCategory === category.category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.category)}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="faq-content">
                    {filteredFaqs.map((category, categoryIndex) => (
                        <div key={category.category} className="faq-category">
                            <h2 className="category-title">{category.category}</h2>
                            <div className="faq-list">
                                {category.questions.map((item, questionIndex) => {
                                    const key = `${categoryIndex}-${questionIndex}`;
                                    const isOpen = openItems[key];

                                    return (
                                        <div
                                            key={questionIndex}
                                            className={`faq-item ${isOpen ? 'open' : ''}`}
                                        >
                                            <button
                                                className="faq-question"
                                                onClick={() => toggleItem(categoryIndex, questionIndex)}
                                            >
                                                <span>{item.q}</span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`faq-arrow ${isOpen ? 'open' : ''}`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="faq-answer">
                                                    <p>{item.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="no-results">
                            <h3>No results found</h3>
                            <p>Try different keywords or browse all categories</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact Section */}
                <div className="contact-section">
                    <h2>Still have questions?</h2>
                    <p>Our support team is here to help you</p>
                    <div className="contact-options">
                        <a href="mailto:support@clothshare.in" className="contact-card">
                            <Mail size={24} />
                            <div>
                                <h3>Email Support</h3>
                                <p>support@clothshare.in</p>
                            </div>
                        </a>
                        <div className="contact-card">
                            <MessageCircle size={24} />
                            <div>
                                <h3>Live Chat</h3>
                                <p>Available 9 AM - 6 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
