import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PaymentButton from '../components/PaymentButton';
import { useState } from 'react';
import './Cart.css';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart, getCartTotal, isAuthenticated, currentUser } = useApp();
    const [showPayment, setShowPayment] = useState(false);

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-empty">
                        <ShoppingCart size={64} />
                        <h2>Your cart is empty</h2>
                        <p>Browse our collection and add items to your cart</p>
                        <Link to="/browse" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const totalAmount = getCartTotal();
    const totalDeposit = cartItems.reduce((sum, item) =>
        sum + (item.security_deposit || item.securityDeposit || 0), 0);
    const subtotal = totalAmount - totalDeposit;

    const handlePaymentSuccess = (paymentData) => {
        clearCart();
        navigate('/dashboard');
    };

    const handlePaymentFailure = (error) => {
        alert('Payment failed: ' + (error.description || 'Please try again'));
    };

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <Link to="/browse" className="back-link">
                        <ArrowLeft size={20} />
                        Continue Shopping
                    </Link>
                    <h1><ShoppingCart size={28} /> My Cart ({cartItems.length})</h1>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => {
                            const price = item.daily_price || item.dailyPrice || 0;
                            const deposit = item.security_deposit || item.securityDeposit || 0;
                            const days = item.rentalDays || 1;
                            const itemTotal = (price * days) + deposit;

                            return (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'}
                                        alt={item.title}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h3>{item.title}</h3>
                                        <p className="cart-item-meta">
                                            {item.size && <span>Size: {item.size}</span>}
                                            {item.color && <span>Color: {item.color}</span>}
                                        </p>
                                        <p className="cart-item-dates">
                                            <Package size={14} />
                                            {item.startDate} to {item.endDate} ({days} days)
                                        </p>
                                    </div>
                                    <div className="cart-item-pricing">
                                        <div className="cart-price-row">
                                            <span>Rental:</span>
                                            <span>₹{price * days}</span>
                                        </div>
                                        <div className="cart-price-row">
                                            <span>Deposit:</span>
                                            <span>₹{deposit}</span>
                                        </div>
                                        <div className="cart-price-total">
                                            <span>Total:</span>
                                            <span>₹{itemTotal}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="cart-remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="summary-row">
                                <span>Security Deposits (refundable)</span>
                                <span>₹{totalDeposit}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>

                        {showPayment ? (
                            <PaymentButton
                                amount={subtotal}
                                securityDeposit={totalDeposit}
                                itemTitle={`${cartItems.length} items`}
                                rentalDays={cartItems.reduce((sum, i) => sum + (i.rentalDays || 1), 0)}
                                userName={currentUser?.name}
                                userEmail={currentUser?.email}
                                userPhone={currentUser?.phone}
                                rentalId={`cart_${Date.now()}`}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentFailure={handlePaymentFailure}
                            />
                        ) : (
                            <button
                                className="btn btn-primary btn-lg w-full checkout-btn"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate('/login');
                                        return;
                                    }
                                    setShowPayment(true);
                                }}
                            >
                                <CreditCard size={20} />
                                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                            </button>
                        )}

                        <button
                            className="btn btn-secondary w-full clear-cart-btn"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
