// ============================================================
// දැනුම් මධ්‍යස්ථානය controller (Knowledge Hub)
// වගා මාර්ගෝපදේශ සහ රෝග හඳුනාගැනීම
// ============================================================
const db = require('../config/db');

// ---- ලිපි ලැයිස්තුව (GET /api/knowledge?type=guide|disease&search=) ----
exports.getAll = async (req, res) => {
  try {
    const { type, search } = req.query;
    let sql = 'SELECT * FROM knowledge WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }
    // රෝග හෝ ලක්ෂණ අනුව සෙවීම
    if (search) {
      sql += ' AND (title LIKE ? OR summary LIKE ? OR symptoms LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY type, created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- තනි ලිපියක් (GET /api/knowledge/:id) ----
exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM knowledge WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'ලිපිය හමු නොවීය' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- ලිපියක් එක් කිරීම (POST /api/knowledge) - admin only ----
exports.create = async (req, res) => {
  try {
    const { type, title, summary, body, symptoms, treatment, image } = req.body;
    const [r] = await db.query(
      'INSERT INTO knowledge (type, title, summary, body, symptoms, treatment, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [type, title, summary, body, symptoms, treatment, image]
    );
    res.status(201).json({ id: r.insertId, message: 'ලිපිය එක් කරන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};

// ---- ලිපියක් වෙනස් කිරීම (PUT /api/knowledge/:id) - admin only ----
exports.update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { type, title, summary, body, symptoms, treatment, image } = req.body;

    const sql = `
      UPDATE knowledge 
      SET type = ?, title = ?, summary = ?, body = ?, symptoms = ?, treatment = ?, image = ? 
      WHERE id = ?
    `;
    
    const [result] = await db.query(sql, [type, title, summary, body, symptoms, treatment, image, postId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Knowledge post not found" });
    }

    res.status(200).json({ message: "Post updated successfully!" });
  } catch (error) {
    console.error("Error updating knowledge post:", error);
    res.status(500).json({ message: "Server error while updating post" });
  }
};

// ---- ලිපියක් මැකීම (DELETE /api/knowledge/:id) - admin only ----
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM knowledge WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'ලිපිය හමු නොවීය' });
    }
    res.json({ message: 'ලිපිය මකා දමන ලදී' });
  } catch (err) {
    res.status(500).json({ message: 'සේවාදායක දෝෂයක්', error: err.message });
  }
};