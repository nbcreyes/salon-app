const express = require('express');
const router = express.Router();
const {
  getMyBookings,
  getAllBookings,
  createBooking,
  cancelBooking,
  rescheduleBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/my', protect, getMyBookings);
router.get('/', protect, requireRole('admin'), getAllBookings);
router.post('/', protect, createBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/reschedule', protect, rescheduleBooking);
router.put('/:id/status', protect, requireRole('admin'), updateBookingStatus);

module.exports = router;