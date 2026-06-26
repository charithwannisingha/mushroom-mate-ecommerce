// දැනුම් මධ්‍යස්ථාන මාර්ග (knowledge routes)
const router = require('express').Router();
const c = require('../controllers/knowledgeController');
const { protect, authorize } = require('../middleware/auth');

// ඕනෑම කෙනෙකුට බැලිය හැකි Routes (Public)
router.get('/', c.getAll);      // සියලුම Posts ලබාගැනීමට
router.get('/:id', c.getOne);   // එක Post එකක් පමණක් ලබාගැනීමට

// Admin සඳහා පමණක් ඇති Routes (Protected)
router.post('/', protect, authorize('admin'), c.create);         // අලුත් Post එකක් දැමීමට
router.put('/:id', protect, authorize('admin'), c.update);       // පවතින Post එකක් Edit කිරීමට (අලුතින් එකතු කළේ)
router.delete('/:id', protect, authorize('admin'), c.remove);    // Post එකක් මකා දැමීමට

module.exports = router;