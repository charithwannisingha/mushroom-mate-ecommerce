const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// --- පවතින User සහ Reports Routes ---
router.get('/users', protect, authorize('admin'), c.getUsers);
router.put('/verify/:id', protect, authorize('admin'), c.verifyFarmer);
router.delete('/users/:id', protect, authorize('admin'), c.deleteUser);
router.get('/stats', protect, authorize('admin'), c.stats);
router.get('/reports/sales', protect, authorize('admin'), c.salesReport);
router.get('/reports/farmer', protect, authorize('farmer', 'admin'), c.farmerReport);

// --- අලුතින් එකතු කළ Routes ---
// Products (නිෂ්පාදන)
router.post('/products', protect, authorize('admin'), c.addProduct);
router.put('/products/:id', protect, authorize('admin'), c.editProduct);
router.delete('/products/:id', protect, authorize('admin'), c.deleteProduct);

// Categories (කාණ්ඩ)
router.post('/categories', protect, authorize('admin'), c.addCategory);
router.put('/categories/:id', protect, authorize('admin'), c.editCategory);
router.delete('/categories/:id', protect, authorize('admin'), c.deleteCategory);

// Knowledge Hub (දැනුම මධ්‍යස්ථානය)
router.post('/knowledge', protect, authorize('admin'), c.addKnowledgePost);
router.put('/knowledge/:id', protect, authorize('admin'), c.editKnowledgePost);
router.delete('/knowledge/:id', protect, authorize('admin'), c.deleteKnowledgePost);

module.exports = router;