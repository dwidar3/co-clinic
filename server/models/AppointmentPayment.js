import mongoose from 'mongoose';

const appointmentPaymentSchema = new mongoose.Schema({
  notes: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  stripePaymentIntentId: {  // Changed from stripeSessionId
    type: String,
    // required: true,
    // unique: true,
  },
  stripeSessionId: {
    type: String,
    // unique: true
  },
  amount: {
    type: Number,
    // required: true,
      // Removed default since amount comes from env variable

    },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('AppointmentPayment', appointmentPaymentSchema);