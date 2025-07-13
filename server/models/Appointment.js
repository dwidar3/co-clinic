import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The actual scheduled date/time
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending','confirmed','cancelled','completed'],
    default: 'pending'
  },
  notes: String,           // any patient notes
}, { timestamps: true });

appointmentSchema.index({ doctor: 1, start: 1, end: 1 }); // for fast conflict queries

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment