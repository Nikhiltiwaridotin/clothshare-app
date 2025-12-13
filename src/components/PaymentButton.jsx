import { useState } from 'react';
import { CreditCard, Shield, CheckCircle, XCircle, Loader } from 'lucide-react';
import { initiatePayment, createOrder } from '../lib/razorpay';

export default function PaymentButton({
    amount,
    itemTitle,
    rentalDays,
    securityDeposit = 0,
    userEmail,
    userName,
    userPhone,
    rentalId,
    onPaymentSuccess,
    onPaymentFailure,
    disabled = false,
    className = ''
}) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'failed', null

    const totalAmount = amount + securityDeposit;

    const handlePayment = async () => {
        setLoading(true);
        setStatus(null);

        try {
            // Create order (in production, this would be an API call)
            const order = await createOrder(totalAmount, 'INR', `rental_${rentalId}`);

            // Initiate Razorpay payment
            await initiatePayment({
                amount: totalAmount,
                currency: 'INR',
                name: 'ClothShare',
                description: `Rental: ${itemTitle} (${rentalDays} days)`,
                orderId: order.id,
                prefill: {
                    name: userName,
                    email: userEmail,
                    phone: userPhone,
                    rentalId
                },
                onSuccess: (paymentData) => {
                    setStatus('success');
                    setLoading(false);
                    if (onPaymentSuccess) {
                        onPaymentSuccess({
                            ...paymentData,
                            amount: totalAmount,
                            rentalId
                        });
                    }
                },
                onFailure: (error) => {
                    setStatus('failed');
                    setLoading(false);
                    if (onPaymentFailure) {
                        onPaymentFailure(error);
                    }
                },
                onDismiss: () => {
                    setLoading(false);
                }
            });
        } catch (error) {
            setStatus('failed');
            setLoading(false);
            if (onPaymentFailure) {
                onPaymentFailure({ description: error.message });
            }
        }
    };

    return (
        <div className="payment-button-container">
            {/* Payment Summary */}
            <div className="payment-summary">
                <div className="payment-row">
                    <span>Rental ({rentalDays} days)</span>
                    <span>₹{amount}</span>
                </div>
                {securityDeposit > 0 && (
                    <div className="payment-row">
                        <span>Security Deposit (refundable)</span>
                        <span>₹{securityDeposit}</span>
                    </div>
                )}
                <div className="payment-row payment-total">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>

            {/* Payment Button */}
            <button
                onClick={handlePayment}
                disabled={disabled || loading}
                className={`btn btn-primary btn-lg w-full payment-btn ${className} ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <Loader className="spin" size={20} />
                        Processing...
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle size={20} />
                        Payment Successful!
                    </>
                ) : status === 'failed' ? (
                    <>
                        <XCircle size={20} />
                        Payment Failed - Try Again
                    </>
                ) : (
                    <>
                        <CreditCard size={20} />
                        Pay ₹{totalAmount}
                    </>
                )}
            </button>

            {/* Security Badge */}
            <div className="payment-security">
                <Shield size={14} />
                <span>Secured by Razorpay</span>
            </div>

            <style>{`
                .payment-button-container {
                    width: 100%;
                }

                .payment-summary {
                    background: var(--bg-secondary);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }

                .payment-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .payment-total {
                    border-top: 1px solid var(--border);
                    margin-top: 0.5rem;
                    padding-top: 0.75rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 1rem;
                }

                .payment-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .payment-btn .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .payment-security {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                }

                .payment-security svg {
                    color: var(--success);
                }
            `}</style>
        </div>
    );
}
