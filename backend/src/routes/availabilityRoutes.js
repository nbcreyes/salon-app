const express = require('express');
const router = express.Router();
const { getAvailability, setAvailability } = require('../controllers/availabilityController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getAvailability);
router.post('/', protect, requireRole('admin'), setAvailability);

module.exports = router;