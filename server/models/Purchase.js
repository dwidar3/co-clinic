import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  stripeSessionId: { 
    type: String, 
    sparse: true 
  },
  stripePaymentIntentId: { 
    type: String, 
    sparse: true 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Purchase', purchaseSchema);