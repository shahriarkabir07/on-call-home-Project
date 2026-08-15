const pool = require('./database');


// =====================================================
// GET SERVICE CATEGORIES
// =====================================================

async function getCategories() {

    return {
        success: true,

        categories: [
            { name: 'Painter', icon: '🎨' },
            { name: 'Electrician', icon: '⚡' },
            { name: 'Plumber', icon: '🔧' },
            { name: 'Carpenter', icon: '🪵' },
            { name: 'Cleaner', icon: '🧹' }
        ]
    };
}


// =====================================================
// GET WORKERS BY CATEGORY
// =====================================================

async function getWorkersByCategory(category) {

    try {

        const [rows] = await pool.execute(

            `SELECT 
                u.user_id,
                u.full_name,
                u.phone,
                u.worker_rate,
                u.worker_category,

                -- Average rating
                AVG(r.rating) AS average_rating,

                -- Number of reviews
                COUNT(r.review_id) AS review_count

             FROM users u

             LEFT JOIN reviews r
                ON u.user_id = r.worker_id

             WHERE 
                u.role = 'worker'
                AND u.worker_category = ?

             GROUP BY
                u.user_id,
                u.full_name,
                u.phone,
                u.worker_rate,
                u.worker_category

             ORDER BY
                average_rating DESC`

            ,

            [category]
        );


        // Convert database values into proper JavaScript numbers

        const workers = rows.map(worker => ({

            user_id: worker.user_id,

            full_name: worker.full_name,

            phone: worker.phone,

            worker_rate: worker.worker_rate,

            worker_category: worker.worker_category,

            average_rating:
                worker.average_rating !== null
                    ? Number(worker.average_rating)
                    : null,

            review_count:
                Number(worker.review_count)

        }));


        return {

            success: true,

            workers: workers

        };

    }
    catch (error) {

        console.error(
            'GET WORKERS ERROR:',
            error
        );

        return {

            success: false,

            workers: [],

            message:
                'Failed to load workers'

        };
    }
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getCategories,

    getWorkersByCategory

};