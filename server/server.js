const express = require('express');

const auth = require('../backend/auth');
const service = require('../backend/service');
const booking = require('../backend/booking');
const review = require('../backend/review');

const app = express();

app.use(express.json());

// =====================================================
// BASIC
// =====================================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'OnCall Home API is running'
    });
});


// =====================================================
// DATABASE TEST
// =====================================================

app.get('/api/test-db', async (req, res) => {
    try {
        const pool = require('../backend/database');

        const [rows] = await pool.execute(
            'SELECT 1 AS connected'
        );

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


// =====================================================
// AUTH - REGISTER
// =====================================================

app.post('/api/auth/register', async (req, res) => {
    try {
        const data = req.body;

        const result = await auth.registerUser(
            data.fullName,
            data.email,
            data.password,
            data.phone,
            data.role,
            data.workerCategory,
            data.workerRate
        );

        res.json(result);

    } catch (error) {
        console.error('Register API error:', error);

        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});


// =====================================================
// AUTH - LOGIN
// =====================================================

app.post('/api/auth/login', async (req, res) => {
    try {
        const data = req.body;

        const result = await auth.loginUser(
            data.email,
            data.password
        );

        res.json(result);

    } catch (error) {
        console.error('Login API error:', error);

        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});


// =====================================================
// SERVICES - CATEGORIES
// =====================================================

app.get('/api/services/categories', async (req, res) => {
    try {
        const result = await service.getCategories();

        res.json(result);

    } catch (error) {
        console.error('Categories API error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load categories'
        });
    }
});


// =====================================================
// SERVICES - WORKERS BY CATEGORY
// =====================================================

app.get('/api/services/workers', async (req, res) => {
    try {
        const category = req.query.category;

        const result =
            await service.getWorkersByCategory(category);

        res.json(result);

    } catch (error) {
        console.error('Workers API error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load workers'
        });
    }
});


// =====================================================
// BOOKINGS - CREATE
// =====================================================

app.post('/api/bookings', async (req, res) => {
    try {
        const data = req.body;

        const result = await booking.createBooking(
            data.userId,
            data.serviceId,
            data.customerAddress,
            data.workerId
        );

        res.json(result);

    } catch (error) {
        console.error('Create booking API error:', error);

        res.status(500).json({
            success: false,
            message: 'Booking failed'
        });
    }
});


// =====================================================
// BOOKINGS - CUSTOMER
// =====================================================

app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const result =
            await booking.getUserBookings(userId);

        res.json(result);

    } catch (error) {
        console.error('User bookings API error:', error);

        res.status(500).json({
            success: false,
            bookings: [],
            message: 'Could not load bookings'
        });
    }
});


// =====================================================
// BOOKINGS - WORKER
// =====================================================

app.get('/api/bookings/worker/:workerId', async (req, res) => {
    try {
        const workerId = Number(req.params.workerId);

        const result =
            await booking.getWorkerBookings(workerId);

        res.json(result);

    } catch (error) {
        console.error('Worker bookings API error:', error);

        res.status(500).json({
            success: false,
            bookings: [],
            message: 'Could not load worker bookings'
        });
    }
});


// =====================================================
// BOOKINGS - UPDATE STATUS
// =====================================================

app.patch('/api/bookings/:bookingId/status', async (req, res) => {
    try {
        const bookingId =
            Number(req.params.bookingId);

        const status = req.body.status;

        const result =
            await booking.updateBookingStatus(
                bookingId,
                status
            );

        res.json(result);

    } catch (error) {
        console.error('Update booking API error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update booking'
        });
    }
});


// =====================================================
// BOOKINGS - ADMIN
// =====================================================

app.get('/api/bookings/admin', async (req, res) => {
    try {
        const result =
            await booking.getAllBookings();

        res.json(result);

    } catch (error) {
        console.error('Admin bookings API error:', error);

        res.status(500).json({
            success: false,
            bookings: [],
            message: 'Could not load bookings'
        });
    }
});


// =====================================================
// REVIEWS - ADD
// =====================================================

app.post('/api/reviews', async (req, res) => {
    try {
        const data = req.body;

        const result = await review.addReview(
            data.bookingId,
            data.customerId,
            data.workerId,
            data.rating,
            data.reviewText
        );

        res.json(result);

    } catch (error) {
        console.error('Add review API error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to submit review'
        });
    }
});


// =====================================================
// REVIEWS - WORKER
// =====================================================

app.get('/api/reviews/worker/:workerId', async (req, res) => {
    try {
        const workerId = Number(req.params.workerId);

        const result =
            await review.getWorkerReviews(workerId);

        res.json(result);

    } catch (error) {
        console.error('Worker reviews API error:', error);

        res.status(500).json({
            success: false,
            reviews: [],
            message: 'Failed to load reviews'
        });
    }
});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `OnCall Home API running on port ${PORT}`
    );
});