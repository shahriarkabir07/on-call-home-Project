const pool = require('./database');

// =====================================================
// CREATE BOOKING
// =====================================================
async function createBooking(userId, serviceId, customerAddress, workerId) {

    try {

        // Check that the selected worker really exists
        const [workers] = await pool.execute(
            `SELECT user_id, full_name, worker_category, worker_rate
             FROM users
             WHERE user_id = ?
             AND role = 'worker'`,
            [workerId]
        );

        if (workers.length === 0) {
            return {
                success: false,
                message: 'Selected worker was not found'
            };
        }

        if (!customerAddress || customerAddress.trim() === '') {
            return {
                success: false,
                message: 'Customer address is required'
            };
        }

        // Create booking
        const [result] = await pool.execute(
            `INSERT INTO bookings
            (user_id, service_id, customer_address, worker_id, status)
            VALUES (?, ?, ?, ?, 'Pending')`,
            [
                userId,
                serviceId,
                customerAddress.trim(),
                workerId
            ]
        );

        return {
            success: true,
            bookingId: result.insertId,
            message: 'Booking submitted successfully'
        };

    } catch (error) {

        console.error('CREATE BOOKING ERROR:', error);

        return {
            success: false,
            message: 'Booking failed'
        };
    }
}


// =====================================================
// CUSTOMER BOOKINGS
// =====================================================
async function getUserBookings(userId) {

    try {

        const [rows] = await pool.execute(

            `SELECT
                b.booking_id,
                b.user_id,
                b.worker_id,

                w.full_name AS worker_name,
                w.phone AS worker_phone,
                w.worker_category,
                w.worker_rate,

                s.service_id,
                s.service_name,

                b.customer_address,
                b.status,
                b.booking_date

             FROM bookings b

             JOIN services s
                ON b.service_id = s.service_id

             LEFT JOIN users w
                ON b.worker_id = w.user_id

             WHERE b.user_id = ?

             ORDER BY b.booking_date DESC`,

            [userId]
        );

        // Use the selected worker's rate
        const bookings = rows.map(row => ({
            ...row,
            price: row.worker_rate !== null
                ? Number(row.worker_rate)
                : 0
        }));

        return {
            success: true,
            bookings
        };

    } catch (error) {

        console.error('GET USER BOOKINGS ERROR:', error);

        return {
            success: false,
            bookings: [],
            message: 'Could not load bookings'
        };
    }
}


// =====================================================
// WORKER BOOKINGS
// =====================================================
async function getWorkerBookings(workerId) {

    try {

        const [rows] = await pool.execute(

            `SELECT
                b.booking_id,

                u.user_id AS customer_id,
                u.full_name,
                u.email,
                u.phone,

                b.customer_address,

                s.service_id,
                s.service_name,

                w.worker_rate,

                b.status,
                b.booking_date,
                b.worker_note

             FROM bookings b

             JOIN users u
                ON b.user_id = u.user_id

             JOIN services s
                ON b.service_id = s.service_id

             JOIN users w
                ON b.worker_id = w.user_id

             WHERE b.worker_id = ?

             ORDER BY b.booking_date DESC`,

            [workerId]
        );

        const bookings = rows.map(row => ({
            ...row,
            price: Number(row.worker_rate || 0)
        }));

        return {
            success: true,
            bookings
        };

    } catch (error) {

        console.error('GET WORKER BOOKINGS ERROR:', error);

        return {
            success: false,
            bookings: [],
            message: 'Could not load worker bookings'
        };
    }
}


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================
async function updateBookingStatus(bookingId, status) {

    try {

        const allowedStatuses = [
            'Pending',
            'Accepted',
            'Rejected',
            'Completed'
        ];

        if (!allowedStatuses.includes(status)) {

            return {
                success: false,
                message: 'Invalid booking status'
            };
        }

        const [result] = await pool.execute(

            `UPDATE bookings
             SET status = ?
             WHERE booking_id = ?`,

            [status, bookingId]
        );

        if (result.affectedRows === 0) {

            return {
                success: false,
                message: 'Booking not found'
            };
        }

        return {
            success: true,
            message: `Booking ${status}`
        };

    } catch (error) {

        console.error('UPDATE BOOKING ERROR:', error);

        return {
            success: false,
            message: 'Failed to update booking'
        };
    }
}


// =====================================================
// ADMIN - ALL BOOKINGS
// =====================================================
async function getAllBookings() {

    try {

        const [rows] = await pool.execute(

            `SELECT
                b.booking_id,

                u.full_name,
                u.email,

                s.service_name,

                w.full_name AS worker_name,
                w.worker_rate,

                b.customer_address,
                b.status,
                b.booking_date

             FROM bookings b

             JOIN users u
                ON b.user_id = u.user_id

             JOIN services s
                ON b.service_id = s.service_id

             LEFT JOIN users w
                ON b.worker_id = w.user_id

             ORDER BY b.booking_date DESC`
        );

        const bookings = rows.map(row => ({
            ...row,
            price: Number(row.worker_rate || 0)
        }));

        return {
            success: true,
            bookings
        };

    } catch (error) {

        console.error('GET ALL BOOKINGS ERROR:', error);

        return {
            success: false,
            bookings: [],
            message: 'Could not load bookings'
        };
    }
}


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createBooking,
    getUserBookings,
    getWorkerBookings,
    updateBookingStatus,
    getAllBookings
};