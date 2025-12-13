// Vercel Serverless Function: Create Razorpay Order
// Endpoint: POST /api/create-order

const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, currency = 'INR', receipt } = req.body || {};

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required', received: amount });
    }

    // Check for required environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log('Environment check - Key ID exists:', !!keyId, 'Key Secret exists:', !!keySecret);

    if (!keyId || !keySecret) {
        console.error('Razorpay credentials not configured');
        return res.status(500).json({ error: 'Payment service not configured' });
    }

    try {
        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });

        console.log('Creating order for amount:', amount, 'paise:', Math.round(amount * 100));

        // Create order - amount must be in paise (smallest currency unit)
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: {
                source: 'ClothShare'
            }
        });

        console.log('Order created successfully:', order.id);

        return res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            }
        });
    } catch (error) {
        console.error('Razorpay order creation failed:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        return res.status(500).json({
            error: 'Failed to create order',
            details: error.message,
            code: error.statusCode || error.code
        });
    }
};
