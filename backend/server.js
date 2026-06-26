// ============================================================
// MUSHROOM MATE - ප්‍රධාන සේවාදායකය (Express server)
// ============================================================
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./config/db'); // දත්ත සමුදා සම්බන්ධතාවය ආරම්භ කරයි

const app = express();

// ---- Middleware ----
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- API මාර්ග (routes) ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/knowledge', require('./routes/knowledgeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// සෞඛ්‍ය පරීක්ෂාව (health check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Mushroom Mate API', time: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'මාර්ගය හමු නොවීය (Route not found)' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🍄 Mushroom Mate සේවාදායකය ක්‍රියාත්මකයි → http://localhost:${PORT}\n`);
});
