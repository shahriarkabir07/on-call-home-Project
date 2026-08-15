const pool = require('./database');

async function test() {
  try {
    const [rows] = await pool.execute('SELECT 1 AS test');
    console.log('Database connected successfully');
    console.log(rows);
  } catch (err) {
    console.error('Database connection failed');
    console.error(err);
  }
}

test();