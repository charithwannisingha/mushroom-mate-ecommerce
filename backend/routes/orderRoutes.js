// ඇණවුම් මාර්ග (order routes)
const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), c.create);
router.get('/my', protect, c.myOrders);
router.get('/farmer', protect, authorize('farmer', 'admin'), c.farmerOrders);
router.get('/', protect, authorize('admin'), c.allOrders);
router.put('/:id/status', protect, authorize('farmer', 'admin'), c.updateStatus);

module.exports = router;
