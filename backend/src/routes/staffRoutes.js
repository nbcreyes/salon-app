const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', protect, requireRole('admin'), createStaff);
router.put('/:id', protect, requireRole('admin'), updateStaff);
router.delete('/:id', protect, requireRole('admin'), deleteStaff);

module.exports = router;