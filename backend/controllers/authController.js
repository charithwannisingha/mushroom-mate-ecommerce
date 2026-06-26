// ============================================================
// Authentication Controller - Registration, Login, Profile
// ============================================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'mushroom_mate_super_secret_key_2026';
const EXPIRES = process.env.JWT_EXPIRES || '7d';

// Generates a JWT token
function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET,
    { expiresIn: EXPIRES }
  );
}

// Adds a record to the audit log (SRS 5.2)
async function logAction(userId, action) {
  try {
    await db.query('INSERT INTO audit_log (user_id, action) VALUES (?, ?)', [userId, action]);
  } catch (_) { 
    /* Fails silently */ 
  }
}

// ---- Registration (POST /api/auth/register) ----
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, farm_name, city, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Password rules validation (SRS 5.3: 8-12 characters, numbers + special characters)
    if (password.length < 8 || password.length > 12) {
      return res.status(400).json({ message: 'Password must be between 8 and 12 characters long' });
    }

    // Checks if the email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'This email address is already registered' });
    }

    // Hashes the password using Bcrypt
    const hash = await bcrypt.hash(password, 10);
    const userRole = ['farmer', 'customer'].includes(role) ? role : 'customer';

    // Farmers remain unverified (is_verified = 0) until approved by the admin
    const isVerified = userRole === 'customer' ? 1 : 0;

    const [result] = await db.query(
      `INSERT INTO users (name, email, password, role, phone, farm_name, city, address, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hash, userRole, phone || null, farm_name || null, city || null, address || null, isVerified]
    );

    const user = { id: result.insertId, name, email, role: userRole, is_verified: isVerified };
    await logAction(user.id, `New ${userRole} registered`);

    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// ---- Login (POST /api/auth/login) ----
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await logAction(user.id, 'User logged in');

    // Removes the password field before sending user data back
    delete user.password;
    res.json({ token: signToken(user), user });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

// ---- Current User Profile (GET /api/auth/me) ----
exports.me = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, phone, address, city, farm_name, is_verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching profile', error: err.message });
  }
};

// ---- Update Profile (PUT /api/auth/me) ----
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, farm_name } = req.body;
    await db.query(
      'UPDATE users SET name=?, phone=?, address=?, city=?, farm_name=? WHERE id=?',
      [name, phone, address, city, farm_name, req.user.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating profile', error: err.message });
  }
};