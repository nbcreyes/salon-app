const Availability = require('../models/Availability');

const getAvailability = async (req, res) => {
  try {
    const { staffId, date } = req.query;

    if (!staffId || !date) {
      return res.status(400).json({ message: 'staffId and date are required' });
    }

    const availability = await Availability.findOne({ staff: staffId, date });

    if (!availability) {
      return res.status(404).json({ message: 'No availability found' });
    }

    const openSlots = availability.slots.filter(
      (slot) => !availability.bookedSlots.includes(slot)
    );

    res.json({ date, staffId, openSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setAvailability = async (req, res) => {
  try {
    const { staff, date, slots } = req.body;

    let availability = await Availability.findOne({ staff, date });

    if (availability) {
      availability.slots = slots;
      await availability.save();
    } else {
      availability = await Availability.create({ staff, date, slots, bookedSlots: [] });
    }

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAvailability, setAvailability };