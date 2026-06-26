const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let sql = 'SELECT id, name, email, role, phone, city, farm_name, is_verified, created_at FROM users';
    const params = [];
    if (role && role !== 'all') {
      sql += ' WHERE role = ?';
      params.push(role);
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

exports.verifyFarmer = async (req, res) => {
  try {
    const { verified } = req.body;
    await db.query('UPDATE users SET is_verified = ? WHERE id = ?', [verified ? 1 : 0, req.params.id]);
    await db.query('INSERT INTO audit_log (user_id, action) VALUES (?, ?)',
      [req.user.id, `${verified ? 'Verified' : 'Unverified'} farmer #${req.params.id}`]);
    res.json({ message: verified ? 'ගොවියා තහවුරු කරන ලදී' : 'තහවුරුව ඉවත් කරන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'ඔබටම මැකිය නොහැක' });
    }
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'පරිශීලකයා මකා දමන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) AS c FROM users');
    const [[farmers]] = await db.query("SELECT COUNT(*) AS c FROM users WHERE role='farmer'");
    const [[customers]] = await db.query("SELECT COUNT(*) AS c FROM users WHERE role='customer'");
    const [[pendingFarmers]] = await db.query("SELECT COUNT(*) AS c FROM users WHERE role='farmer' AND is_verified=0");
    const [[products]] = await db.query('SELECT COUNT(*) AS c FROM products');
    const [[orders]] = await db.query('SELECT COUNT(*) AS c FROM orders');
    const [[revenue]] = await db.query("SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE status != 'cancelled'");

    res.json({
      users: users.c, farmers: farmers.c, customers: customers.c,
      pendingFarmers: pendingFarmers.c, products: products.c,
      orders: orders.c, revenue: revenue.s
    });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

exports.salesReport = async (req, res) => {
  try {
    const [monthly] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
             COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
      FROM orders WHERE status != 'cancelled'
      GROUP BY month ORDER BY month DESC LIMIT 6`);

    const [byCategory] = await db.query(`
      SELECT p.category, COALESCE(SUM(oi.price * oi.qty),0) AS revenue, SUM(oi.qty) AS units
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      GROUP BY p.category ORDER BY revenue DESC`);

    const [topProducts] = await db.query(`
      SELECT name, SUM(qty) AS sold, SUM(price*qty) AS revenue
      FROM order_items GROUP BY name ORDER BY sold DESC LIMIT 5`);

    res.json({ monthly: monthly.reverse(), byCategory, topProducts });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

exports.farmerReport = async (req, res) => {
  try {
    const [[summary]] = await db.query(`
      SELECT COALESCE(SUM(oi.price*oi.qty),0) AS revenue, COALESCE(SUM(oi.qty),0) AS units,
             COUNT(DISTINCT oi.order_id) AS orders
      FROM order_items oi WHERE oi.farmer_id = ?`, [req.user.id]);

    const [monthly] = await db.query(`
      SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS month,
             COALESCE(SUM(oi.price*oi.qty),0) AS revenue
      FROM order_items oi JOIN orders o ON oi.order_id = o.id
      WHERE oi.farmer_id = ? AND o.status != 'cancelled'
      GROUP BY month ORDER BY month DESC LIMIT 6`, [req.user.id]);

    const [topProducts] = await db.query(`
      SELECT name, SUM(qty) AS sold, SUM(price*qty) AS revenue
      FROM order_items WHERE farmer_id = ? GROUP BY name ORDER BY sold DESC LIMIT 5`, [req.user.id]);

    res.json({ summary, monthly: monthly.reverse(), topProducts });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ==========================================
// 1. Categories
// ==========================================
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });
    const sql = `INSERT INTO categories (name, description) VALUES (?, ?)`;
    await db.query(sql, [name, description]);
    res.status(201).json({ message: "Category created successfully!" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Category already exists" });
    res.status(500).json({ message: error.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    const sql = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;
    const [result] = await db.query(sql, [name, description, categoryId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const sql = `DELETE FROM categories WHERE id = ?`;
    const [result] = await db.query(sql, [categoryId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. Admin Knowledge Hub
// ==========================================
exports.addKnowledgePost = async (req, res) => { res.status(200).json({ message: "OK" }); };
exports.editKnowledgePost = async (req, res) => { res.status(200).json({ message: "OK" }); };
exports.deleteKnowledgePost = async (req, res) => { res.status(200).json({ message: "OK" }); };

// ==========================================
// 3. Admin Products
// ==========================================
exports.addProduct = async (req, res) => { res.status(200).json({ message: "OK" }); };
exports.editProduct = async (req, res) => { res.status(200).json({ message: "OK" }); };
exports.deleteProduct = async (req, res) => { res.status(200).json({ message: "OK" }); };