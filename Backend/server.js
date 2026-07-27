const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',         
    password: '', // Empty password for XAMPP
    database: 'oncall_home',
    waitForConnections: true,
    connectionLimit: 10
});

app.get('/api/workers/:category', (req, res) => {
    const categoryName = req.params.category;
    const sqlQuery = "SELECT name, rating, rate, availability FROM workers WHERE category = ?";

    db.query(sqlQuery, [categoryName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results); 
    });
});
// New API Endpoint to handle creating a booking
app.post('/api/bookings', (req, res) => {
    const { worker_name, customer_name } = req.body;
    const sqlQuery = "INSERT INTO bookings (worker_name, customer_name) VALUES (?, ?)";

    db.query(sqlQuery, [worker_name, customer_name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to create booking" });
        }
        res.json({ message: "Booking saved successfully!", bookingId: result.insertId });
    });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));