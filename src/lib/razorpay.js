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

// Create a payment order (in production, this should be done on the server)
export const createOrder = async (amount, currency = 'INR', receipt = null) => {
    // For demo/client-side only mode, we don't create a real order
    // In production, this should call your backend which creates order via Razorpay API
    return {
        id: null, // No order_id for client-side only mode
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`
    };
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
    console.log('Initiating payment for amount:', amount);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
        console.error('Razorpay SDK failed to load');
        throw new Error('Failed to load Razorpay SDK');
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency,
        name,
        description,
        // Don't include order_id for client-side only mode
        // order_id is only needed when you create orders on backend
        image: '/favicon.ico',
        handler: function (response) {
            console.log('Payment successful:', response);
            // Payment successful
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
            color: '#6366f1' // Primary color
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

    console.log('Razorpay options:', { ...options, key: '***hidden***' });

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
        console.log('Opening Razorpay modal...');
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
    // In production, send to your backend to verify signature
    // using Razorpay's webhook or verification endpoint
    console.log('Payment verification data:', paymentData);
    return { verified: true, ...paymentData };
};

export default {
    loadRazorpayScript,
    createOrder,
    initiatePayment,
    verifyPayment
};

