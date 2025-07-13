// routes/book.js
import express from 'express';
import verifyToken from '../utils/verifyUser.js';
import upload from '../config/upload.js';
import { createBook, deleteBook, getBook, getBooks, updateBook, createCheckoutSession, verifyPayment, createPaymentIntent } from '../controllers/books.js';
import verifyDoctor from '../middleware/doctorMiddleware.js';

const router = express.Router();

router.post('/create', verifyToken, createBook);
router.delete('/delete/:id', verifyToken, deleteBook);
router.post('/update/:id', verifyToken, updateBook);
router.get('/get', getBooks);
router.get('/get/:id', getBook);
// router.get('/download/:bookId', verifyToken, downloadBookPdf);
router.post('/create-payment-intent', verifyToken, createPaymentIntent);
router.post('/create-checkout-session', verifyToken, createCheckoutSession);
router.get('/verify-payment', verifyToken, verifyPayment);

export default router;