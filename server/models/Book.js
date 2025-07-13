import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author:{
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true,
    },
    
    regularPrice: {
      type: Number,
      required: true,
    },
    
    discountPrice: {
      type: Number,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },

    // new
    pdfUrl: {
    type: String,
    default: null,
  },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;
