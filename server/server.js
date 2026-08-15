const express = require('express');
const pool = require('../backend/database');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'OnCall Home API is running'
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1 AS connected');

        res.json({
            success: true,
            message: 'Database connected successfully',
            data: rows
        });

    } catch (error) {
        console.error('Database error:', error);

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`OnCall Home API running on port ${PORT}`);
});