const Booking = require('../models/Booking');
const Availability = require('../models/Availability');

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('staff', 'name email')
      .populate('service', 'name price duration');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('staff', 'name email')
      .populate('service', 'name price duration');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { staff, service, date, timeSlot, notes } = req.body;

    const availability = await Availability.findOne({ staff, date });
    if (!availability) {
      return res.status(400).json({ message: 'No availability found for this staff on this date' });
    }

    if (!availability.slots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    if (availability.bookedSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      staff,
      service,
      date,
      timeSlot,
      notes,
    });

    availability.bookedSlots.push(timeSlot);
    await availability.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const availability = await Availability.findOne({ staff: booking.staff, date: booking.date });
    if (availability) {
      availability.bookedSlots = availability.bookedSlots.filter((s) => s !== booking.timeSlot);
      await availability.save();
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rescheduleBooking = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newAvailability = await Availability.findOne({ staff: booking.staff, date });
    if (!newAvailability) {
      return res.status(400).json({ message: 'No availability found for this date' });
    }

    if (!newAvailability.slots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    if (newAvailability.bookedSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const oldAvailability = await Availability.findOne({ staff: booking.staff, date: booking.date });
    if (oldAvailability) {
      oldAvailability.bookedSlots = oldAvailability.bookedSlots.filter((s) => s !== booking.timeSlot);
      await oldAvailability.save();
    }

    booking.date = date;
    booking.timeSlot = timeSlot;
    booking.status = 'pending';
    await booking.save();

    newAvailability.bookedSlots.push(timeSlot);
    await newAvailability.save();

    res.json({ message: 'Booking rescheduled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyBookings,
  getAllBookings,
  createBooking,
  cancelBooking,
  rescheduleBooking,
  updateBookingStatus,
};