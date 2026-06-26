// ============================================================
// සත්‍යාපන middleware (Authentication + RBAC)
// JWT token පරීක්ෂා කර පරිශීලක භූමිකා (roles) තහවුරු කරයි
// ============================================================
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'mushroom_mate_super_secret_key_2026';

// Token එක verify කර පරිශීලකයා සත්‍යාපනය කරයි
function protect(req, res, next) {
  const header = req.headers.authorization;

  // "Bearer <token>" ආකෘතිය පරීක්ෂා කරයි
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ඇතුළු වීම අවශ්‍යයි (Not authorized, no token)' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, role, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token වලංගු නැත (Invalid token)' });
  }
}

// Role-Based Access Control - නිශ්චිත භූමිකා සඳහා පමණක් අවසර දෙයි
// උදා: authorize('admin'), authorize('farmer','admin')
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ඔබට මෙම ක්‍රියාවට අවසර නැත (Forbidden)' });
    }
    next();
  };
}

module.exports = { protect, authorize };
