// නිෂ්පාදන මාර්ග (product routes)
const router = require('express').Router();
const c = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// --- Categories (වර්ග) කළමනාකරණය සඳහා මාර්ග (Admin ට පමණයි) ---
router.post('/categories', protect, authorize('admin'), c.createCategory);
router.put('/categories/:id', protect, authorize('admin'), c.updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), c.deleteCategory);

// --- Products (නිෂ්පාදන) සඳහා මාර්ග ---
// පොදු මාර්ග (ඕනෑම කෙනෙකුට බැලිය හැක)
router.get('/', c.getAll);
router.get('/:id', c.getOne);

// ගොවි සහ Admin විශේෂ මාර්ග
router.get('/my/list', protect, authorize('farmer', 'admin'), c.getMyProducts);
router.get('/alerts/low', protect, authorize('farmer', 'admin'), c.lowStock);
router.post('/', protect, authorize('farmer', 'admin'), c.create);
router.put('/:id', protect, authorize('farmer', 'admin'), c.update);
router.delete('/:id', protect, authorize('farmer', 'admin'), c.remove);

module.exports = router;