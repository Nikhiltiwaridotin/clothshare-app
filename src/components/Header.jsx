import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    Menu,
    X,
    Search,
    Heart,
    User,
    Plus,
    LogOut,
    LayoutDashboard,
    ShoppingCart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Header.css';

export default function Header() {
    const location = useLocation();
    const { isAuthenticated, currentUser, logout, isMobileMenuOpen, setIsMobileMenuOpen, cartCount } = useApp();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/browse', label: 'Browse' },
        { path: '/how-it-works', label: 'How it Works' },
        { path: '/faq', label: 'FAQ' }
    ];

    return (
        <header className="header">
            <div className="header-container container">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <span className="logo-icon">👔👗</span>
                    <span className="logo-text">ClothShare</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav hide-mobile">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/browse" className="btn btn-ghost btn-icon hide-mobile" title="Search">
                                <Search size={20} />
                            </Link>
                            <Link to="/saved" className="btn btn-ghost btn-icon hide-mobile" title="Saved Items">
                                <Heart size={20} />
                            </Link>
                            <Link to="/cart" className="btn btn-ghost btn-icon cart-icon hide-mobile" title="Cart">
                                <ShoppingCart size={20} />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                            <Link to="/list-item" className="btn btn-primary hide-mobile">
                                <Plus size={18} />
                                <span>List Item</span>
                            </Link>

                            {/* User Menu */}
                            <div className="user-menu-wrapper">
                                <button
                                    className="user-menu-trigger"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    <div className="avatar avatar-md">
                                        {currentUser?.avatar ? (
                                            <img src={currentUser.avatar} alt={currentUser.name} />
                                        ) : (
                                            currentUser?.name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="user-menu">
                                        <div className="user-menu-header">
                                            <div className="avatar avatar-lg">
                                                {currentUser?.avatar ? (
                                                    <img src={currentUser.avatar} alt={currentUser.name} />
                                                ) : (
                                                    currentUser?.name?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div className="user-menu-info">
                                                <p className="user-menu-name">{currentUser?.name}</p>
                                                <p className="user-menu-email">{currentUser?.email}</p>
                                            </div>
                                        </div>
                                        <div className="user-menu-divider" />
                                        <Link to="/dashboard" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                                            <LayoutDashboard size={18} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                                            <User size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link to="/saved" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                                            <Heart size={18} />
                                            <span>Saved Items</span>
                                        </Link>
                                        <div className="user-menu-divider" />
                                        <button className="user-menu-item user-menu-logout" onClick={() => { logout(); setShowUserMenu(false); }}>
                                            <LogOut size={18} />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost hide-mobile">
                                Log in
                            </Link>
                            <Link to="/signup" className="btn btn-primary">
                                Sign up
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle hide-desktop"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <nav className="mobile-nav">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <>
                                <div className="mobile-nav-divider" />
                                <Link
                                    to="/dashboard"
                                    className="mobile-nav-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/list-item"
                                    className="mobile-nav-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    List an Item
                                </Link>
                                <Link
                                    to="/saved"
                                    className="mobile-nav-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Saved Items
                                </Link>
                            </>
                        )}
                    </nav>
                    {!isAuthenticated && (
                        <div className="mobile-menu-actions">
                            <Link
                                to="/login"
                                className="btn btn-secondary w-full"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="btn btn-primary w-full"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
