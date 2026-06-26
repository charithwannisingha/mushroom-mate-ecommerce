// ============================================================
// නිෂ්පාදන controller - එකතු කිරීම, සංස්කරණය, මැකීම, සෙවීම
// ============================================================
const db = require('../config/db');

// ---- සියලුම නිෂ්පාදන (GET /api/products) - පොදු ----
// query params: category, search, sort
exports.getAll = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let sql = `
      SELECT p.*, u.name AS farmer_name, u.farm_name, u.city AS farm_city
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.is_active = 1`;
    const params = [];

    // කාණ්ඩය අනුව පෙරීම (filter by category)
    if (category && category !== 'All') {
      sql += ' AND p.category = ?';
      params.push(category);
    }
    // නම/විස්තරය අනුව සෙවීම (search)
    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // පෙළගැස්ම (sorting)
    if (sort === 'price_asc') sql += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY p.price DESC';
    else sql += ' ORDER BY p.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- තනි නිෂ්පාදනයක් (GET /api/products/:id) ----
exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name AS farmer_name, u.farm_name, u.city AS farm_city, u.phone AS farmer_phone
       FROM products p JOIN users u ON p.farmer_id = u.id WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'නිෂ්පාදනය හමු නොවීය' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- ගොවියාගේ නිෂ්පාදන (GET /api/products/my/list) - farmer only ----
exports.getMyProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- නිෂ්පාදනයක් එක් කිරීම (POST /api/products) - farmer only ----
exports.create = async (req, res) => {
  try {
    const { name, category, description, price, unit, stock, low_stock_at, image } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ message: 'නම, කාණ්ඩය සහ මිල අවශ්‍යයි' });
    }
    const [result] = await db.query(
      `INSERT INTO products (farmer_id, name, category, description, price, unit, stock, low_stock_at, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, category, description || '', price, unit || 'kg', stock || 0, low_stock_at || 10,
       image || 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=800&q=80']
    );
    res.status(201).json({ id: result.insertId, message: 'නිෂ්පාදනය එක් කරන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- නිෂ්පාදනයක් යාවත්කාලීන කිරීම (PUT /api/products/:id) - farmer only ----
exports.update = async (req, res) => {
  try {
    // ගොවියාට තම නිෂ්පාදනය පමණක් සංස්කරණය කළ හැක
    const [own] = await db.query('SELECT farmer_id FROM products WHERE id = ?', [req.params.id]);
    if (!own.length) return res.status(404).json({ message: 'නිෂ්පාදනය හමු නොවීය' });
    if (own[0].farmer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'අවසර නැත' });
    }

    const { name, category, description, price, unit, stock, low_stock_at, image, is_active } = req.body;
    await db.query(
      `UPDATE products SET name=?, category=?, description=?, price=?, unit=?, stock=?, low_stock_at=?, image=?, is_active=?
       WHERE id=?`,
      [name, category, description, price, unit, stock, low_stock_at, image, is_active ?? 1, req.params.id]
    );
    res.json({ message: 'නිෂ්පාදනය යාවත්කාලීන කරන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- නිෂ්පාදනයක් මැකීම (DELETE /api/products/:id) ----
exports.remove = async (req, res) => {
  try {
    const [own] = await db.query('SELECT farmer_id FROM products WHERE id = ?', [req.params.id]);
    if (!own.length) return res.status(404).json({ message: 'නිෂ්පාදනය හමු නොවීය' });
    if (own[0].farmer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'අවසර නැත' });
    }
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'නිෂ්පාදනය මකා දමන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- අඩු තොග අනතුරු ඇඟවීම් (GET /api/products/alerts/low) - farmer only ----
exports.lowStock = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE farmer_id = ? AND stock <= low_stock_at ORDER BY stock ASC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};
// ==========================================
// Categories සඳහා අලුතින් එකතු කළ Functions
// ==========================================

exports.createCategory = async (req, res) => {
  try {
    res.status(201).json({ message: "Category create route is ready" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    res.status(200).json({ message: "Category update route is ready" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    res.status(200).json({ message: "Category delete route is ready" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};