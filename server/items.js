import express from 'express';
import pool from './db.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Get user's items (MUST be before /:id route)
router.get('/user/my-items', authMiddleware, async (req, res) => {
    try {
        const [items] = await pool.query(
            'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        items.forEach(item => {
            if (typeof item.images === 'string') {
                try {
                    item.images = JSON.parse(item.images);
                } catch {
                    item.images = [];
                }
            }
        });

        res.json({ success: true, items });
    } catch (error) {
        console.error('Get my items error:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Get all items (with filters)
router.get('/', async (req, res) => {
    try {
        const { category, size, minPrice, maxPrice, search, limit = 50 } = req.query;

        let query = `
      SELECT i.*, u.name as owner_name, u.avatar as owner_avatar, u.rating as owner_rating
      FROM items i
      JOIN users u ON i.user_id = u.id
      WHERE i.status = 'available'
    `;
        const params = [];

        if (category) {
            query += ' AND i.category = ?';
            params.push(category);
        }

        if (size) {
            query += ' AND i.size = ?';
            params.push(size);
        }

        if (minPrice) {
            query += ' AND i.daily_price >= ?';
            params.push(minPrice);
        }

        if (maxPrice) {
            query += ' AND i.daily_price <= ?';
            params.push(maxPrice);
        }

        if (search) {
            query += ' AND (i.title LIKE ? OR i.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY i.created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const [items] = await pool.query(query, params);

        // Parse images JSON
        items.forEach(item => {
            if (typeof item.images === 'string') {
                try {
                    item.images = JSON.parse(item.images);
                } catch {
                    item.images = [];
                }
            }
        });

        res.json({ success: true, items });
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Get single item
router.get('/:id', async (req, res) => {
    try {
        const [items] = await pool.query(`
      SELECT i.*, u.name as owner_name, u.avatar as owner_avatar, u.rating as owner_rating, 
             u.review_count as owner_review_count, u.campus as owner_campus, u.building as owner_building
      FROM items i
      JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `, [req.params.id]);

        if (items.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const item = items[0];

        // Parse images JSON
        if (typeof item.images === 'string') {
            try {
                item.images = JSON.parse(item.images);
            } catch {
                item.images = [];
            }
        }

        // Increment view count
        await pool.query('UPDATE items SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);

        // Get reviews for this item
        const [reviews] = await pool.query(`
      SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.item_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);

        item.reviews = reviews;

        res.json({ success: true, item });
    } catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// Create item (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            subcategory,
            size,
            color,
            brand,
            condition,
            daily_price,
            security_deposit,
            weekly_discount,
            images
        } = req.body;

        if (!title || !daily_price) {
            return res.status(400).json({ error: 'Title and daily price are required' });
        }

        const [result] = await pool.query(
            `INSERT INTO items (user_id, title, description, category, subcategory, size, color, brand, item_condition, daily_price, security_deposit, weekly_discount, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                title,
                description || null,
                category || null,
                subcategory || null,
                size || null,
                color || null,
                brand || null,
                condition || null,
                daily_price,
                security_deposit || 0,
                weekly_discount || 0,
                JSON.stringify(images || [])
            ]
        );

        const [items] = await pool.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
        const item = items[0];

        if (typeof item.images === 'string') {
            item.images = JSON.parse(item.images);
        }

        res.status(201).json({
            success: true,
            message: 'Item listed successfully',
            item
        });
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// Update item (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Check ownership
        const [items] = await pool.query('SELECT * FROM items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

        if (items.length === 0) {
            return res.status(404).json({ error: 'Item not found or not authorized' });
        }

        const {
            title,
            description,
            category,
            subcategory,
            size,
            color,
            brand,
            condition,
            daily_price,
            security_deposit,
            weekly_discount,
            images,
            status
        } = req.body;

        await pool.query(
            `UPDATE items SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        subcategory = COALESCE(?, subcategory),
        size = COALESCE(?, size),
        color = COALESCE(?, color),
        brand = COALESCE(?, brand),
        item_condition = COALESCE(?, item_condition),
        daily_price = COALESCE(?, daily_price),
        security_deposit = COALESCE(?, security_deposit),
        weekly_discount = COALESCE(?, weekly_discount),
        images = COALESCE(?, images),
        status = COALESCE(?, status)
       WHERE id = ?`,
            [title, description, category, subcategory, size, color, brand, condition, daily_price, security_deposit, weekly_discount, images ? JSON.stringify(images) : null, status, req.params.id]
        );

        const [updated] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            item: updated[0]
        });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Delete item (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found or not authorized' });
        }

        res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;

