// ============================================================
// දත්ත සමුදාය සම්බන්ධතාවය (MySQL connection pool)
// ============================================================
const mysql = require('mysql2');
require('dotenv').config();

// Connection pool එකක් සෑදීම - එකම වර connections කිහිපයක් කළමනාකරණය කරයි
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mushroom_mate',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Promise-based pool එක export කරයි (async/await භාවිතය සඳහා)
const db = pool.promise();

// ආරම්භයේදී සම්බන්ධතාවය පරීක්ෂා කරයි
db.getConnection()
  .then((conn) => {
    console.log('✓ MySQL දත්ත සමුදායට සාර්ථකව සම්බන්ධ විය (connected)');
    conn.release();
  })
  .catch((err) => {
    console.error('✗ දත්ත සමුදා සම්බන්ධතා දෝෂයක් (DB connection error):', err.message);
  });

module.exports = db;
