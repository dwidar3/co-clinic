import mongoose from 'mongoose';

const PneumoniaScanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    enum: ['NORMAL', 'PNEUMONIA'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('PneumoniaScan', PneumoniaScanSchema);
