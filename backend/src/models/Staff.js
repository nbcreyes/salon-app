const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
  day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  start: { type: String },
  end: { type: String },
});

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    photo: { type: String, default: '' },
    specialties: [{ type: String }],
    workingHours: [workingHoursSchema],
    daysOff: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);