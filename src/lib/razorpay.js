// Razorpay Payment Integration for ClothShare
// This utility handles payment processing for clothing rentals

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx';

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Create a payment order (in production, this should be done on the server)
export const createOrder = async (amount, currency = 'INR', receipt = null) => {
    // For demo purposes, we'll create a mock order
    // In production, this should call your backend which creates order via Razorpay API
    return {
        id: `order_${Date.now()}`,
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
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency,
        name,
        description,
        order_id: orderId,
        image: '/favicon.ico',
        handler: function (response) {
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
                if (onDismiss) {
                    onDismiss();
                }
            }
        }
    };

    try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
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
