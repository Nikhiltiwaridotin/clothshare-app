// Razorpay Payment Integration for ClothShare
// This utility handles payment processing for clothing rentals

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx';

// Log the key for debugging (remove in production)
console.log('Razorpay Key:', RAZORPAY_KEY_ID ? 'Key is set' : 'Key is NOT set');

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            console.log('Razorpay SDK already loaded');
            resolve(true);
            return;
        }

        console.log('Loading Razorpay SDK...');
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            console.log('Razorpay SDK loaded successfully');
            resolve(true);
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay SDK');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

// Create a payment order via backend API
export const createOrder = async (amount, currency = 'INR', receipt = null) => {
    console.log('Creating order on backend for amount:', amount);

    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                receipt: receipt || `receipt_${Date.now()}`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create order');
        }

        console.log('Order created:', data.order);
        return data.order;
    } catch (error) {
        console.error('Order creation failed:', error);
        throw error;
    }
};

// Initialize Razorpay payment
export const initiatePayment = async ({
    amount,
    currency = 'INR',
    name = 'ClothShare',
    description = 'Clothing Rental Payment',
    orderId,
    prefill = {},
    onSuccess,
    onFailure,
    onDismiss
}) => {
    console.log('Initiating payment for amount:', amount, 'Order ID:', orderId);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
        console.error('Razorpay SDK failed to load');
        throw new Error('Failed to load Razorpay SDK');
    }

    if (!orderId) {
        console.error('No order_id provided - this will cause checkout to fail');
        throw new Error('Order ID is required for payment');
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise (for display only, actual amount comes from order)
        currency,
        name,
        description,
        order_id: orderId, // CRITICAL: This must be a valid order_id from backend
        image: '/favicon.ico',
        handler: function (response) {
            console.log('Payment successful:', response);
            if (onSuccess) {
                onSuccess({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                });
            }
        },
        prefill: {
            name: prefill.name || '',
            email: prefill.email || '',
            contact: prefill.phone || ''
        },
        notes: {
            rental_id: prefill.rentalId || ''
        },
        theme: {
            color: '#6366f1'
        },
        modal: {
            ondismiss: function () {
                console.log('Payment modal dismissed');
                if (onDismiss) {
                    onDismiss();
                }
            }
        }
    };

    console.log('Opening Razorpay checkout with order_id:', orderId);

    try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            if (onFailure) {
                onFailure({
                    code: response.error.code,
                    description: response.error.description,
                    source: response.error.source,
                    step: response.error.step,
                    reason: response.error.reason
                });
            }
        });
        razorpay.open();
    } catch (error) {
        console.error('Razorpay error:', error);
        if (onFailure) {
            onFailure({ description: error.message });
        }
    }
};

// Verify payment (in production, this should be done on the server)
export const verifyPayment = async (paymentData) => {
    console.log('Payment verification data:', paymentData);
    return { verified: true, ...paymentData };
};

export default {
    loadRazorpayScript,
    createOrder,
    initiatePayment,
    verifyPayment
};
