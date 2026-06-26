// ============================================================
// ඇණවුම් controller - checkout, ලැයිස්තුගත කිරීම, තත්ත්ව යාවත්කාලීනය
// ============================================================
const db = require('../config/db');

// ---- ඇණවුමක් කිරීම / checkout (POST /api/orders) - customer ----
exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { items, ship_name, ship_phone, ship_address, ship_city, payment_method } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'කරත්තය හිස්ය (Cart is empty)' });
    }

    // Transaction ආරම්භ කරයි - තොගය සහ ඇණවුම එකට යාවත්කාලීන වේ
    await conn.beginTransaction();

    // සෑම අයිතමයකම මිල සහ තොගය දත්ත සමුදායෙන් තහවුරු කරයි (security)
    let total = 0;
    const validated = [];
    for (const it of items) {
      const [p] = await conn.query('SELECT * FROM products WHERE id = ? AND is_active = 1', [it.id]);
      if (!p.length) throw new Error(`නිෂ්පාදනය හමු නොවීය (id ${it.id})`);
      const product = p[0];
      if (product.stock < it.qty) {
        throw new Error(`${product.name} සඳහා ප්‍රමාණවත් තොගයක් නැත`);
      }
      total += Number(product.price) * it.qty;
      validated.push({ product, qty: it.qty });
    }

    // ඇණවුම සාදයි
    const [order] = await conn.query(
      `INSERT INTO orders (customer_id, total, ship_name, ship_phone, ship_address, ship_city, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, total, ship_name, ship_phone, ship_address, ship_city, payment_method || 'Cash on Delivery']
    );
    const orderId = order.insertId;

    // අයිතම එක් කර තොගය අඩු කරයි (inventory auto-update - SRS)
    for (const v of validated) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, farmer_id, name, price, qty) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, v.product.id, v.product.farmer_id, v.product.name, v.product.price, v.qty]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [v.qty, v.product.id]);
    }

    await conn.query('INSERT INTO audit_log (user_id, action) VALUES (?, ?)',
      [req.user.id, `Placed order #${orderId} (Rs.${total})`]);

    await conn.commit();
    res.status(201).json({ orderId, total, message: 'ඇණවුම සාර්ථකව තැබිණි!' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: err.message || 'ඇණවුම අසාර්ථකයි' });
  } finally {
    conn.release();
  }
};

// ---- පාරිභෝගිකයාගේ ඇණවුම් (GET /api/orders/my) ----
exports.myOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    // එක් එක් ඇණවුමට අයිතම එක් කරයි
    for (const o of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      o.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- ගොවියාට ලැබුණු ඇණවුම් (GET /api/orders/farmer) ----
exports.farmerOrders = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT oi.*, o.status, o.created_at, o.ship_name, o.ship_city, o.ship_phone
       FROM order_items oi JOIN orders o ON oi.order_id = o.id
       WHERE oi.farmer_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- සියලුම ඇණවුම් (GET /api/orders) - admin only ----
exports.allOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email
       FROM orders o JOIN users u ON o.customer_id = u.id ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- ඇණවුම් තත්ත්වය යාවත්කාලීන කිරීම (PUT /api/orders/:id/status) ----
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'වලංගු නොවන තත්ත්වයක්' });

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'ඇණවුම් තත්ත්වය යාවත්කාලීන කරන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};
