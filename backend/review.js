const pool = require('./database');

// Add review
async function addReview(bookingId, customerId, workerId, rating, reviewText) {
    try {

        await pool.execute(
            `INSERT INTO reviews
            (booking_id, customer_id, worker_id, rating, review_text)
            VALUES (?, ?, ?, ?, ?)`,
            [bookingId, customerId, workerId, rating, reviewText]
        );

        return {
            success: true,
            message: 'Review submitted successfully'
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: 'Failed to submit review'
        };
    }
}

// Get worker reviews
async function getWorkerReviews(workerId) {
    try {

        const [rows] = await pool.execute(
            `SELECT r.rating, r.review_text, r.created_at,
                    u.full_name
             FROM reviews r
             JOIN users u ON r.customer_id = u.user_id
             WHERE r.worker_id = ?
             ORDER BY r.created_at DESC`,
            [workerId]
        );

        return {
            success: true,
            reviews: rows
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            reviews: []
        };
    }
}

module.exports = {
    addReview,
    getWorkerReviews
};