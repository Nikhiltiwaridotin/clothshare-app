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

    // Parse body - Vercel should auto-parse JSON but let's be safe
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = {};
        }
    }
    body = body || {};

    const { amount, currency = 'INR', receipt } = body;

    console.log('Received request body:', JSON.stringify(body));
    console.log('Amount:', amount, 'Type:', typeof amount);

    if (!amount || amount <= 0) {
        return res.status(400).json({
            error: 'Valid amount is required',
            received: amount,
            receivedType: typeof amount,
            fullBody: body
        });
    }

    // Check for required environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

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

        const amountInPaise = Math.round(amount * 100);
        console.log('Creating order - Amount in rupees:', amount, 'Amount in paise:', amountInPaise);

        // Create order - amount must be in paise (smallest currency unit)
        const order = await razorpay.orders.create({
            amount: amountInPaise,
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

        // Razorpay errors have additional details in error.error
        const errorDetails = error.error || {};

        return res.status(500).json({
            error: 'Failed to create order',
            details: errorDetails.description || error.message,
            code: error.statusCode || error.code,
            razorpayError: errorDetails,
            receivedAmount: amount,
            amountInPaise: Math.round(amount * 100)
        });
    }
};

