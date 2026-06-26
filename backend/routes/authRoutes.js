// සත්‍යාපන මාර්ග (auth routes)
const router = require('express').Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', protect, c.me);
router.put('/me', protect, c.updateProfile);

module.exports = router;
