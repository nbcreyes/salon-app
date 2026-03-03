const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', protect, requireRole('admin'), createService);
router.put('/:id', protect, requireRole('admin'), updateService);
router.delete('/:id', protect, requireRole('admin'), deleteService);

module.exports = router;