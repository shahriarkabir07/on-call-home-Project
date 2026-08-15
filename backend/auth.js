const pool = require('./database');
const bcrypt = require('bcryptjs');

async function registerUser(
    fullName,
    email,
    password,
    phone,
    role,
    workerCategory = null,
    workerRate = 0
) {
    try {

        const [existing] = await pool.execute(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return {
                success: false,
                message: 'Email already registered'
            };
        }

        // Only customer and worker can register normally
        if (role !== 'customer' && role !== 'worker') {
            return {
                success: false,
                message: 'Invalid role'
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            `INSERT INTO users
            (full_name, email, password, phone, role, worker_category, worker_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                fullName,
                email,
                hashedPassword,
                phone,
                role,
                role === 'worker' ? workerCategory : null,
                role === 'worker' ? workerRate : 0
            ]
        );

        return {
            success: true,
            message: 'Registration successful'
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: 'Database error'
        };
    }
}

async function loginUser(email, password) {

    try {

        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }

        return {
            success: true,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                worker_category: user.worker_category,
                worker_rate: user.worker_rate
            }
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: 'Database error'
        };
    }
}

module.exports = {
    registerUser,
    loginUser
};