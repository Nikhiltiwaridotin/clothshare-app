import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Blog.css';

const blogPosts = [
    {
        id: 1,
        title: 'Top 10 Wedding Outfit Trends for 2024',
        excerpt: 'Discover the latest trends in wedding fashion that are taking the industry by storm. From bold colors to sustainable choices.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
        author: 'Priya Sharma',
        date: 'December 10, 2024',
        category: 'Wedding'
    },
    {
        id: 2,
        title: 'How to Choose the Perfect Lehenga for Your Body Type',
        excerpt: 'A comprehensive guide to selecting a lehenga that complements your body shape and makes you feel confident.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
        author: 'Anjali Verma',
        date: 'December 5, 2024',
        category: 'Style Guide'
    },
    {
        id: 3,
        title: 'Sustainable Fashion: Why Renting is the Future',
        excerpt: 'Learn how clothing rental is revolutionizing the fashion industry and helping reduce environmental impact.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
        author: 'Rahul Mehta',
        date: 'November 28, 2024',
        category: 'Sustainability'
    },
    {
        id: 4,
        title: 'Festival Season Style: Navratri to Diwali',
        excerpt: 'Get ready for the festive season with our curated outfit ideas for every occasion from Navratri to Diwali.',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop',
        author: 'Neha Patel',
        date: 'November 20, 2024',
        category: 'Festivals'
    },
    {
        id: 5,
        title: 'Accessorizing Your Rental Outfit Like a Pro',
        excerpt: 'Tips and tricks to elevate your rented outfit with the perfect accessories for any occasion.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
        author: 'Kavita Singh',
        date: 'November 15, 2024',
        category: 'Style Guide'
    },
    {
        id: 6,
        title: 'Indo-Western Fusion: The Best of Both Worlds',
        excerpt: 'Explore the beautiful blend of Indian traditional wear with Western silhouettes for a modern look.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop',
        author: 'Sanya Malhotra',
        date: 'November 8, 2024',
        category: 'Fashion'
    }
];

export default function Blog() {
    return (
        <div className="blog-page">
            {/* Hero Section */}
            <section className="blog-hero">
                <div className="container">
                    <span className="blog-badge">Our Blog</span>
                    <h1 className="blog-hero-title">Fashion Insights & Style Tips</h1>
                    <p className="blog-hero-subtitle">
                        Discover the latest trends, styling tips, and fashion inspiration for your special occasions.
                    </p>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="blog-posts-section">
                <div className="container">
                    <div className="blog-grid">
                        {blogPosts.map(post => (
                            <article key={post.id} className="blog-card">
                                <div className="blog-card-image">
                                    <img src={post.image} alt={post.title} />
                                    <span className="blog-category">{post.category}</span>
                                </div>
                                <div className="blog-card-content">
                                    <div className="blog-meta">
                                        <span className="blog-author">
                                            <User size={14} />
                                            {post.author}
                                        </span>
                                        <span className="blog-date">
                                            <Calendar size={14} />
                                            {post.date}
                                        </span>
                                    </div>
                                    <h2 className="blog-card-title">{post.title}</h2>
                                    <p className="blog-card-excerpt">{post.excerpt}</p>
                                    <Link to={`/blog/${post.id}`} className="blog-read-more">
                                        Read More <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="blog-newsletter">
                <div className="container">
                    <h2>Stay Updated</h2>
                    <p>Subscribe to our newsletter for the latest fashion tips and exclusive offers.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit" className="btn btn-primary">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
