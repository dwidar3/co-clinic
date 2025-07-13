// controllers/stripe.js
import Stripe from 'stripe';
import dotenv from 'dotenv';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';
import Book from '../models/Book.js';
import Purchase from '../models/Purchase.js';
import { STATUS_CODE } from '../utils/httpStatusCode.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorResponse('stript.book_not_found', 404));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: book.title },
        unit_amount: book.price * 100, // Convert to cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: { bookId: book._id.toString(), userId: req.user.userId },
  });

  res.status(200).json({ status: STATUS_CODE.SUCCESS, sessionId: session.id, message: req.t('stripe.checkout_created') });
});

export const verifyPayment = catchAsync(async (req, res, next) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === 'paid') {
    const { bookId, userId } = session.metadata;
    await Purchase.create({ userId, bookId, stripeSessionId: session.id });
    res.redirect(`/book/download/${bookId}`); // Redirect to download
  } else {
    return next(new ErrorResponse('stripe.payment_not_completed', 400));
  }
});