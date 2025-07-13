import dotenv from "dotenv";
dotenv.config();

import Book from '../models/Book.js';
import ErrorResponse from '../utils/errorResponse.js';
import upload from '../config/upload.js';
import User from '../models/User.js';
import bookManagemntValidator from '../schema/bookManagementValidator.js';

import {STATUS_CODE} from "../utils/httpStatusCode.js"
import catchAsync from "../utils/catchAsync.js";


import stripe from "../config/stripe.js";
import Purchase from "../models/Purchase.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createPaymentIntent = catchAsync(async (req, res, next) => {
  const { bookId } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorResponse(req.t('book.no_book'), 404));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: book.regularPrice * 100, // Amount in cents
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      bookId: book._id.toString(),
      userId: req.user.userId.toString(),
    },
  });

  res.status(200).json({
    status: STATUS_CODE.SUCCESS,
    message: req.t('book.payment_intent_created'),
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  });
});

export const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { bookId } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorResponse(req.t('book.no_book'), 404));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: book.regularPrice * 100,
          product_data: {
            name: book.title,
            description: book.description,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    metadata: {
      bookId: book._id.toString(),
      userId: req.user.userId.toString(),
    },
  });

  res.status(200).json({
    status: STATUS_CODE.SUCCESS,
    message: req.t('book.checkout_session_created'),
    data: {
      sessionId: session.id,
    url: session.url,
    }
  });
});

export const verifyPayment = catchAsync(async (req, res, next) => {
  const { sessionId, paymentIntentId } = req.body;

  if (!sessionId && !paymentIntentId) {
    return next(new ErrorResponse(req.t('book.session_or_intent_required'), 400));
  }

  let bookId, userId;
  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return next(new ErrorResponse(req.t('book.payment_not_completed'), 400));
    }
    ({ bookId, userId } = paymentIntent.metadata);
    if (userId !== req.user.userId.toString()) {
      return next(new ErrorResponse(req.t('book.unauthorized'), 403));
    }
    const existingPurchase = await Purchase.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!existingPurchase) {
      await Purchase.create({
        userId,
        bookId,
        stripePaymentIntentId: paymentIntent.id,
      });
    }
    return res.status(200).json({
      status: STATUS_CODE.SUCCESS,
      message: req.t('book.payment_verified'),
      bookId,
    });
  } else {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return next(new ErrorResponse(req.t('book.payment_not_completed'), 400));
    }
    ({ bookId, userId } = session.metadata);
    if (userId !== req.user.userId.toString()) {
      return next(new ErrorResponse(req.t('book.unauthorized'), 403));
    }
    const existingPurchase = await Purchase.findOne({ stripeSessionId: session.id });
    if (!existingPurchase) {
      await Purchase.create({
        userId,
        bookId,
        stripeSessionId: session.id,
      });
    }
    res.status(302).json({
      data: {
        downloadUrl: `${process.env.BASE_URL}/api/books/download/${bookId}`
      }
    })
  }
});


export const createBook = catchAsync(async (req, res, next) => {
  const errorInValidation = bookManagemntValidator('create', req.body);
  if (errorInValidation !== true) return next(errorInValidation);

  const pdfUrl = req.files && req.files['pdf'] 
    ? req.files['pdf'][0].filename // Store only the filename
    : null;

    const userRole = await User.findById(req.user.userId)

    console.log("userRole ===> ", userRole)

    if (!userRole?.isAdmin && !userRole?.isDoctor) {
      return next(new ErrorResponse(req.t('middleware.not_admin_doctor'), 403));
    }

    if (userRole?.isAdmin && !userRole?.approved || userRole?.isDoctor && !userRole?.approved) {
      return next(new ErrorResponse(req.t('middleware.not_approved_admin_doctor'), 403));
    }





  const data = await Book.create({
    // imageUrls,
    // pdfUrl,
    userRef: req.user.userId,
    ...req.body,
  });

  return res.status(201).json({
    status: STATUS_CODE.SUCCESS,
    message: req.t('book.book_created'),
    data,
  });
});

// Download book PDF
// export const downloadBookPdf = catchAsync(async (req, res, next) => {
//   const { bookId } = req.params;
//   const userId = req.user.userId;
  
//     const book = await Book.findById(bookId);
//     if (!book || !book.pdfUrl) return next(new ErrorResponse('book.book_pdf_not_found', 404));

//   const purchase = await Purchase.findOne({ userId, bookId });
//   if (!purchase) return next(new ErrorResponse('book.no_access', 403));

// const pdfPath = path.join(__dirname, '..', '..', 'uploads', book.pdfUrl); // Use pdfUrl directly as filename
//   console.log('pdfPath:', pdfPath); // Debugging
//   console.log('File exists:', fs.existsSync(pdfPath));
//   console.log('pdf file not found at :', pdfPath);

//   if (!fs.existsSync(pdfPath)) return next(new ErrorResponse(`book.pdf_not_found`, 404));

//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
//   const stream = fs.createReadStream(pdfPath);
//   stream.pipe(res);
// });



// new






// new

export const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: STATUS_CODE.ERROR,
      message: req.t('book.no_file'),
    });
  }

  const imageUrls = req.files.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);

  res.status(200).json({
    status: STATUS_CODE.SUCCESS,
    message: req.t('book.images_uploaded'),
    data: imageUrls,
  });
});


export const deleteBook = catchAsync(async (req, res, next) => {

  const {id} = req.params

    const errorInValidation = bookManagemntValidator("idOnly", {id});

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }
  

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorResponse('book.book_not_found', 404));
  }
  const user = await User.findById(req.user.userId)

  

  const isAdmin = user?.isAdmin


  if (req.user.userId !== book.userRef && !isAdmin ) {
    return next(new ErrorResponse('book.delete_own_listing_only', 401));
  }

  if(user?.isAdmin && !user?.approved) {
    return next(new ErrorResponse("book.upproved_first_to_delete", 401));
  }

  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({message: req.t('book.book_deleted'), status: STATUS_CODE.SUCCESS});
  } catch (error) {
    next(error);
  }
});


export const updateBook = catchAsync(async (req, res, next) => {

  const {id} = req.params

    const errorInValidation = bookManagemntValidator("idOnly", {id});

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

  const bookFounded = await Book.findById(id);
  if (!bookFounded) {
    return next(new ErrorResponse('book.no_book', 404));
  }
  const user = await User.findById(req.user.userId)
  const isAdmin = user?.isAdmin

  if (req.user.userId !== bookFounded.userRef && !isAdmin) {
    return next(new ErrorResponse('book.update_own_listing', 401));
  }

  if(user?.isAdmin && !user?.approved) {
    return next(new ErrorResponse("book.upproved_first_to_update", 401));
  }

  try {
    const data = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({data, status: STATUS_CODE.SUCCESS, message: req.t('book.book_updated')});
  } catch (error) {
    next(error);
  }
});


export const getBook = catchAsync(async (req, res, next) => {

    const {id} = req.params

    const errorInValidation = bookManagemntValidator("idOnly", {id});

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

    const data = await Book.findById(id);
    if (!data) {
      return next(new ErrorResponse('book.no_book', 404));
    } 
    res.status(200).json({data, status: STATUS_CODE.SUCCESS, message: req.t('book.book_found')});
});


export const getBooks = catchAsync(async (req, res, next) => {
    

    const {limit, startIndex, offer, searchTerm,  sort, order} = req.query

    const errorInValidation = bookManagemntValidator("getBooks", {limit, startIndex, offer, searchTerm,  sort, order});

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

    const safe_limit = parseInt(limit) || 5;
    const safe_startIndex = parseInt(startIndex) || 0;
    let safe_offer = offer;

    if (safe_offer === undefined) {
      safe_offer = { $in: [false, true] };
    } else {
      safe_offer = safe_offer === 'true';
    }
    let safe_searchTerm = searchTerm || '';

    if (searchTerm == '' || searchTerm == "") {
      safe_searchTerm = ''
    }

    console.log(safe_searchTerm)

    const safe_sort = sort || 'createdAt';

    const safe_order = order || 'desc';

    const data = await Book.find({
      title: { $regex: safe_searchTerm, $options: 'i' },
      offer: safe_offer,
    })
      .sort({ [safe_sort]: safe_order })
      .limit(safe_limit)
      .skip(safe_startIndex);

      const totalPosts = await Book.countDocuments();

      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Book.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      return res.status(200).json({
        data,
        status: STATUS_CODE.SUCCESS,
        message: req.t('book.book_recieved'),
        totalPosts,
        lastMonthPosts,
      });

    // return res.status(200).json(listings);
});
