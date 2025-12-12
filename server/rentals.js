import express from 'express';
import pool from './db.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Create rental request
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { item_id, start_date, end_date } = req.body;

        if (!item_id || !start_date || !end_date) {
            return res.status(400).json({ error: 'Item ID, start date and end date are required' });
        }

        // Get item details
        const [items] = await pool.query('SELECT * FROM items WHERE id = ? AND status = "available"', [item_id]);

        if (items.length === 0) {
            return res.status(404).json({ error: 'Item not found or not available' });
        }

        const item = items[0];

        // Can't rent your own item
        if (item.user_id === req.user.id) {
            return res.status(400).json({ error: 'You cannot rent your own item' });
        }

        // Calculate rental details
        const start = new Date(start_date);
        const end = new Date(end_date);
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays < 1) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        let totalAmount = totalDays * item.daily_price;
        if (totalDays >= 7 && item.weekly_discount > 0) {
            totalAmount = totalAmount * (1 - item.weekly_discount / 100);
        }

        // Create rental
        const [result] = await pool.query(
            `INSERT INTO rentals (item_id, renter_id, owner_id, start_date, end_date, total_days, daily_rate, total_amount, deposit_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [item_id, req.user.id, item.user_id, start_date, end_date, totalDays, item.daily_price, totalAmount, item.security_deposit]
        );

        // Update item status
        await pool.query('UPDATE items SET status = "pending" WHERE id = ?', [item_id]);

        const [rentals] = await pool.query(`
      SELECT r.*, i.title as item_title, i.images as item_images,
             u.name as owner_name, u.avatar as owner_avatar
      FROM rentals r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.owner_id = u.id
      WHERE r.id = ?
    `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Rental request submitted successfully',
            rental: rentals[0]
        });
    } catch (error) {
        console.error('Create rental error:', error);
        res.status(500).json({ error: 'Failed to create rental request' });
    }
});

// Get user's rentals (as renter)
router.get('/my-rentals', authMiddleware, async (req, res) => {
    try {
        const [rentals] = await pool.query(`
      SELECT r.*, i.title as item_title, i.images as item_images,
             u.name as owner_name, u.avatar as owner_avatar, u.building as owner_building
      FROM rentals r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.owner_id = u.id
      WHERE r.renter_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);

        rentals.forEach(r => {
            if (typeof r.item_images === 'string') {
                try { r.item_images = JSON.parse(r.item_images); }
                catch { r.item_images = []; }
            }
        });

        res.json({ success: true, rentals });
    } catch (error) {
        console.error('Get my rentals error:', error);
        res.status(500).json({ error: 'Failed to fetch rentals' });
    }
});

// Get requests for user's items (as owner)
router.get('/requests', authMiddleware, async (req, res) => {
    try {
        const [rentals] = await pool.query(`
      SELECT r.*, i.title as item_title, i.images as item_images,
             u.name as renter_name, u.avatar as renter_avatar, u.building as renter_building
      FROM rentals r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.renter_id = u.id
      WHERE r.owner_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);

        rentals.forEach(r => {
            if (typeof r.item_images === 'string') {
                try { r.item_images = JSON.parse(r.item_images); }
                catch { r.item_images = []; }
            }
        });

        res.json({ success: true, rentals });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Accept rental request (owner only)
router.put('/:id/accept', authMiddleware, async (req, res) => {
    try {
        const [rentals] = await pool.query('SELECT * FROM rentals WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id]);

        if (rentals.length === 0) {
            return res.status(404).json({ error: 'Rental not found or not authorized' });
        }

        const rental = rentals[0];

        if (rental.status !== 'pending') {
            return res.status(400).json({ error: 'Rental is not pending' });
        }

        await pool.query('UPDATE rentals SET status = "confirmed" WHERE id = ?', [req.params.id]);
        await pool.query('UPDATE items SET status = "rented" WHERE id = ?', [rental.item_id]);

        res.json({ success: true, message: 'Rental accepted' });
    } catch (error) {
        console.error('Accept rental error:', error);
        res.status(500).json({ error: 'Failed to accept rental' });
    }
});

// Reject rental request (owner only)
router.put('/:id/reject', authMiddleware, async (req, res) => {
    try {
        const [rentals] = await pool.query('SELECT * FROM rentals WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id]);

        if (rentals.length === 0) {
            return res.status(404).json({ error: 'Rental not found or not authorized' });
        }

        const rental = rentals[0];

        await pool.query('UPDATE rentals SET status = "rejected" WHERE id = ?', [req.params.id]);
        await pool.query('UPDATE items SET status = "available" WHERE id = ?', [rental.item_id]);

        res.json({ success: true, message: 'Rental rejected' });
    } catch (error) {
        console.error('Reject rental error:', error);
        res.status(500).json({ error: 'Failed to reject rental' });
    }
});

// Complete rental
router.put('/:id/complete', authMiddleware, async (req, res) => {
    try {
        const [rentals] = await pool.query('SELECT * FROM rentals WHERE id = ? AND (owner_id = ? OR renter_id = ?)',
            [req.params.id, req.user.id, req.user.id]);

        if (rentals.length === 0) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        const rental = rentals[0];

        await pool.query('UPDATE rentals SET status = "completed" WHERE id = ?', [req.params.id]);
        await pool.query('UPDATE items SET status = "available" WHERE id = ?', [rental.item_id]);

        res.json({ success: true, message: 'Rental completed' });
    } catch (error) {
        console.error('Complete rental error:', error);
        res.status(500).json({ error: 'Failed to complete rental' });
    }
});

export default router;
