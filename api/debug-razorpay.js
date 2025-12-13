// Debug endpoint to test Razorpay configuration
const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const debugInfo = {
        keyIdSet: !!keyId,
        keyIdPrefix: keyId ? keyId.substring(0, 12) + '...' : 'NOT SET',
        keySecretSet: !!keySecret,
        keySecretLength: keySecret ? keySecret.length : 0
    };

    if (!keyId || !keySecret) {
        return res.status(200).json({
            status: 'error',
            message: 'Razorpay credentials not configured',
            debug: debugInfo
        });
    }

    try {
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });

        // Try to create a test order for ₹1
        const order = await razorpay.orders.create({
            amount: 100, // ₹1 in paise
            currency: 'INR',
            receipt: 'debug_test_' + Date.now()
        });

        return res.status(200).json({
            status: 'success',
            message: 'Razorpay is configured correctly!',
            orderId: order.id,
            debug: debugInfo
        });
    } catch (error) {
        return res.status(200).json({
            status: 'error',
            message: 'Razorpay API error',
            errorCode: error.statusCode || error.code,
            errorMessage: error.message,
            errorDetails: error.error ? error.error.description : null,
            debug: debugInfo
        });
    }
};
