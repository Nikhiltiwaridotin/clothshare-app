// Vercel Serverless Function: Add Test Item (Admin Only)
// Endpoint: POST /api/add-test-item

const { createClient } = require('@supabase/supabase-js');

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

    // Parse body
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = {};
        }
    }
    body = body || {};

    const {
        userId,
        title,
        description,
        dailyPrice,
        securityDeposit,
        category = 'Casual',
        size = 'M'
    } = body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // Insert the item
        const { data, error } = await supabase
            .from('items')
            .insert({
                user_id: userId,
                title: title || 'Test Payment Item',
                description: description || 'Small price item to test payment flow',
                category: category,
                size: size,
                daily_price: dailyPrice || 1,
                security_deposit: securityDeposit || 10,
                images: ['https://via.placeholder.com/400x400?text=Test+Item'],
                status: 'available'
            })
            .select()
            .single();

        if (error) {
            console.error('Insert error:', error);
            return res.status(500).json({ error: error.message, details: error });
        }

        return res.status(200).json({
            success: true,
            item: data,
            itemUrl: `https://clothshare-app.vercel.app/item/${data.id}`
        });
    } catch (error) {
        console.error('Error adding item:', error);
        return res.status(500).json({ error: error.message });
    }
};
