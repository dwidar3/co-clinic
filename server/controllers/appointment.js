import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import catchAsync from "../utils/catchAsync.js";
import ErrorResponse from "../utils/errorResponse.js";
import appointmentValidator from "../schema/appointmentManagementValidator.js";
import { STATUS_CODE } from "../utils/httpStatusCode.js";
import User from "../models/User.js";

import AppointmentPayment from '../models/AppointmentPayment.js';
import stripe from '../config/stripe.js';




export const createAppointmentPaymentIntent = catchAsync(async (req, res, next) => {
  const { doctorId, start, notes } = req.body;
  const patientId = req.user.userId;

  // Validate appointment details
  const errorInValidation = appointmentValidator('createAppointment', req.body);
  if (errorInValidation !== true) return next(errorInValidation);

  // Validate appointment fee
  if (!process.env.APPOINTMENT_FEE || isNaN(process.env.APPOINTMENT_FEE)) {
    return next(new ErrorResponse('appointment.no_fee', 500));
  }

  // Check if patient and doctor exist
  const patient = await User.findById(patientId);
  if (!patient) return next(new ErrorResponse('appointment.no_patient', 404));
  const doctor = await User.findById(doctorId);
  if (!doctor) return next(new ErrorResponse('appointment.no_doctor', 404));
  if (!doctor.isDoctor) return next(new ErrorResponse('appointment.doctors_only', 403));



    // Validate appointment time
  const startDate = new Date(start);
  const end = new Date(startDate.getTime() + 30 * 60 * 1000);
  const currentDate = new Date();
  if (startDate.getTime() <= currentDate.getTime()) {
    return next(new ErrorResponse(req.t('appointment.no_appointment_in_past'), 400));
  }

  // Check for overlapping appointments
  const conflict = await Appointment.findOne({
    doctor: doctorId,
    $or: [{ start: { $lt: end }, end: { $gt: startDate } }],
  });
  if (conflict) {
    return next(new ErrorResponse(req.t('appointment.doctor_not_free'), 400));
  }

  // Check if an appointment payment is already completed for the same doctor and time
const existingCompletedPayment = await AppointmentPayment.findOne({
  doctorId,
  start: startDate,
  status: 'completed',
});

if (existingCompletedPayment) {
  return next(new ErrorResponse(req.t('appointment.doctor_not_free'), 400));
}


  // Create Payment Intent
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(process.env.APPOINTMENT_FEE),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        doctorId: doctorId.toString(),
        patientId: patientId.toString(),
        start: startDate.toISOString(),
        end: end.toISOString(),
        notes: notes || '',
      },
    });

    

    console.log("paymentIntent.metadata ======> " + paymentIntent.metadata)

    // Create a pending payment record
    await AppointmentPayment.create({
      userId: patientId,
      start: startDate,
      stripePaymentIntentId: paymentIntent.id,
      amount: parseInt(process.env.APPOINTMENT_FEE),
      status: 'pending',
      notes
    });


    res.status(200).json({
      status: STATUS_CODE.SUCCESS,
      message: req.t('appointment.payment_intent_created'),
      data: {
         clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Stripe error: ${error.message}`, 500));
  }
});



// export const createAppointmentPaymentIntent = catchAsync(async (req, res, next) => {
//   const { doctorId, start, notes } = req.body;
//   const patientId = req.user.userId;

//   // Validate appointment details
//   const errorInValidation = appointmentValidator('createAppointment', req.body);
//   if (errorInValidation !== true) return next(errorInValidation);

//   // Validate appointment fee
//   if (!process.env.APPOINTMENT_FEE || isNaN(process.env.APPOINTMENT_FEE)) {
//     return next(new ErrorResponse('appointment.no_fee', 500));
//   }

//   // Check if patient and doctor exist
//   const patient = await User.findById(patientId);
//   if (!patient) return next(new ErrorResponse('appointment.no_patient', 404));
//   const doctor = await User.findById(doctorId);
//   if (!doctor) return next(new ErrorResponse('appointment.no_doctor', 404));
//   if (!doctor.isDoctor) return next(new ErrorResponse('appointment.doctors_only', 403));



//     // Validate appointment time
//   const startDate = new Date(start);
//   const end = new Date(startDate.getTime() + 30 * 60 * 1000);
//   const currentDate = new Date();
//   if (startDate.getTime() <= currentDate.getTime()) {
//     return next(new ErrorResponse(req.t('appointment.no_appointment_in_past'), 400));
//   }

//   // Check for overlapping appointments
//   const conflict = await Appointment.findOne({
//     doctor: doctorId,
//     $or: [{ start: { $lt: end }, end: { $gt: startDate } }],
//   });
//   if (conflict) {
//     return next(new ErrorResponse(req.t('appointment.doctor_not_free'), 400));
//   }

    


//   // Create Payment Intent
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: parseInt(process.env.APPOINTMENT_FEE),
//       currency: 'usd',
//       payment_method_types: ['card'],
//       metadata: {
//         doctorId: doctorId.toString(),
//         patientId: patientId.toString(),
//         start: startDate.toISOString(),
//         end: end.toISOString(),
//         notes: notes || '',
//       },
//     });

    

//     console.log("paymentIntent.metadata ======> " + paymentIntent.metadata)

//     // Create a pending payment record
//     await AppointmentPayment.create({
//       userId: patientId,
//       start: startDate,
//       stripePaymentIntentId: paymentIntent.id,
//       amount: parseInt(process.env.APPOINTMENT_FEE),
//       status: 'pending',
//       notes
//     });


    


//   } catch (error) {
//     return next(new ErrorResponse(`Stripe error: ${error.message}`, 500));
//   }
// });



export const createAppointmentCheckoutSession = catchAsync(async (req, res, next) => {
  const { doctorId, start, notes } = req.body;
  const patientId = req.user.userId;

  // Validate appointment details
  const errorInValidation = appointmentValidator('createAppointment', req.body);
  if (errorInValidation !== true) return next(errorInValidation);

  // Validate appointment fee
  if (!process.env.APPOINTMENT_FEE || isNaN(process.env.APPOINTMENT_FEE)) {
    return next(new ErrorResponse('appointment.no_fee', 500));
  }

  // Check if patient and doctor exist
  const patient = await User.findById(patientId);
  if (!patient) return next(new ErrorResponse('appointment.no_patient', 404));
  const doctor = await User.findById(doctorId);
  if (!doctor) return next(new ErrorResponse('appointment.no_doctor', 404));
  if (!doctor.isDoctor) return next(new ErrorResponse('appointment.doctors_only', 403));



    // Validate appointment time
  const startDate = new Date(start);
  const end = new Date(startDate.getTime() + 30 * 60 * 1000);
  const currentDate = new Date();
  if (startDate.getTime() <= currentDate.getTime()) {
    return next(new ErrorResponse(req.t('appointment.no_appointment_in_past'), 400));
  }

  // Check for overlapping appointments
  const conflict = await Appointment.findOne({
    doctor: doctorId,
    $or: [{ start: { $lt: end }, end: { $gt: startDate } }],
  });
  if (conflict) {
    return next(new ErrorResponse(req.t('appointment.doctor_not_free'), 400));
  }
  // try {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: process.env.APPOINTMENT_FEE ,
          product_data: {
            name: `Appointment with Dr. ${doctor.name}`,
            description: `Consultation appointment on ${startDate.toLocaleString()}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/appointment/confirmation`,
    cancel_url: `${process.env.FRONTEND_URL}/appointment/confirmation`,
    metadata: {
        doctorId: doctorId.toString(),
        patientId: patientId.toString(),
        start: startDate.toISOString(),
        end: end.toISOString(),
        notes: notes || '',
      },
  });
  // } catch (error){
  //     console.error('❌ Stripe Session Creation Error:', error);
  // return next(new ErrorResponse(`Stripe error: ${error.message}`, 500));
  // }


  console.log("session.metadata ======> " + session.metadata)



  //  Store initial payment record
  await AppointmentPayment.create({
    userId: patientId,
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent,
    doctorId,
    start: startDate,
    status: 'pending',
    amount: process.env.APPOINTMENT_FEE,
    notes
  });

  res.status(200).json({
    status: STATUS_CODE.SUCCESS,
    message: req.t('appointment.checkout_session_created'),
    data: {
      sessionId: session.id,
      url: session.url,
    }
  });
});


// Verify payment and book appointment (Unified for Web and Mobile)
export const verifyAppointmentPayment = catchAsync(async (req, res, next) => {
  const { sessionId, paymentIntentId } = req.body;
  const userId = req.user.userId;

  if (!sessionId && !paymentIntentId) {
    return next(new ErrorResponse('appointment.session_or_intent_required', 400));
  }

  let paymentType, stripeObject, payment;

  try {
    // Retrieve payment record first
    payment = await AppointmentPayment.findOne({
      ...(sessionId && { stripeSessionId: sessionId }),
      ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId })
    });

    if (!payment) {
      return next(new ErrorResponse('appointment.payment_not_found', 404));
    }

    // Authorization check
    if (payment.userId.toString() !== userId.toString()) {
      return next(new ErrorResponse('appointment.unauthorized', 403));
    }

    // Already processed check
    if (payment.status === 'completed') {
      return res.status(200).json({
        status: STATUS_CODE.SUCCESS,
        message: req.t('appointment.payment_already_processed'),
        data: { appointmentId: payment.appointmentId }
      });
    }

    // Determine payment type and verify with Stripe
    if (sessionId) {
      paymentType = 'checkout_session';
      stripeObject = await stripe.checkout.sessions.retrieve(sessionId);
      if (stripeObject.payment_status !== 'paid') {
        return next(new ErrorResponse('appointment.payment_not_completed', 400));
      }
    } else {
      paymentType = 'payment_intent';
      stripeObject = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (stripeObject.status !== 'succeeded') {
        return next(new ErrorResponse('appointment.payment_not_completed', 400));
      }
    }

    // Extract appointment details
    const metadata = stripeObject.metadata || {};

    console.log("stripeObject.metadata =====>", stripeObject.metadata)

    const doctorId = metadata.doctorId;
    
    const startDate = new Date(metadata.start);
    
    const notes = metadata.notes || '';

      console.log("startDate || doctorId   ====> ", doctorId, startDate)
      console.log("metadata.doctorId   ====> ", metadata.doctorId)
      console.log(" new Date(metadata.start)  ====> ", new Date(metadata.start))

    // Validate extracted data
    if (!doctorId || !startDate) {
      return next(new ErrorResponse('appointment.missing_metadata', 400));
    }

    // Calculate end time
    const end = new Date(startDate.getTime() + 30 * 60 * 1000);
    const currentDate = new Date();

    // Time validation
    if (startDate <= currentDate) {
      return next(new ErrorResponse('appointment.no_appointment_in_past', 400));
    }

    // Validate input format
    const validationData = {
      doctorId,
      start: startDate.toISOString(),
      notes
    };
    const errorInValidation = appointmentValidator('createAppointment', validationData);
    if (errorInValidation !== true) return next(errorInValidation);

    // Check for conflicts
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      $or: [{ start: { $lt: end }, end: { $gt: startDate } }]
    });
    if (conflict) {
      return next(new ErrorResponse('appointment.doctor_not_free', 400));
    }

    // Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: userId,
      start: startDate,
      end,
      notes,
      status: "confirmed"
    });

    // Update payment record
    payment.appointmentId = appointment._id;
    payment.status = 'completed';
    await payment.save();

    res.status(200).json({
      status: STATUS_CODE.SUCCESS,
      message: req.t('appointment.payment_verified'),
      data: {
        appointmentId: appointment._id,
        confirmationUrl: `${process.env.FRONTEND_URL}/appointment/confirmation`
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Payment verification failed: ${error.message}`, 500));
  }
});

export const getPatientAppointments = catchAsync(async (req, res, next) => {
  const errorInValidation = appointmentValidator("getAppointments", req.query);
  if (errorInValidation !== true) return next(errorInValidation);

  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    end,
    appointmentId
  } = req.query;

  const filters = { patient: req.user.userId };

  if (appointmentId) {
    filters._id = appointmentId;
  }

  if (status) filters.status = status;

  if (startDate || end) {
    filters.start = {};
    if (startDate) filters.start.$gte = new Date(startDate);
    if (end) filters.start.$lte = new Date(end);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const data = await Appointment.find(filters)
    .populate("doctor", "name email")
    .sort("start")
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    data,
    status: STATUS_CODE.SUCCESS,
    message: req.t('appointment.sucess_appointment')
  });
});


export const getDoctorAppointments = catchAsync(async (req, res, next) => {
  const errorInValidation = appointmentValidator("getAppointments", req.query);
  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    end
  } = req.query;

  const filters = { doctor: req.user.userId };
  if (status) filters.status = status;
  if (startDate || end) {
    filters.start = {};
    if (startDate) filters.start.$gte = new Date(startDate);
    if (end)   filters.start.$lte = new Date(end);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const data = await Appointment.find(filters)
    .populate("patient", "name email")
    .sort("start")
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    data,
    status: STATUS_CODE.SUCCESS,
    message: req.t('appointment.doctor_app_fetched')
  });
});             
//doctor 

//status
export const updateAppointmentStatus = catchAsync(async (req, res, next) => {
  // Validate params and body
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("", 400));
  }
  const errorInValidation = appointmentValidator("updateStatus", req.body);
  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

  const { status } = req.body;
  const data = await Appointment.findById(id);
  if (!data) {
    return next(new ErrorResponse("appointment.not_found", 404));
  }

  // Only doctor or admin can change status
  if (String(data.doctor) !== req.user.userId && !req.user.isAdmin) {
    return next(new ErrorResponse("appointment.unaothorized", 403));
  }

  // Prevent illegal transitions
  if (["cancelled", "completed"].includes(data.status)) {
    return next(new ErrorResponse(
      'appointment.cant_modify',
      400
    ));
  }

  data.status = status;
  await data.save();

  res.status(200).json({
    data,
    status: STATUS_CODE.SUCCESS,
    message: req.t('appointment.status_updated')
  });
});

// DELETE /api/v1/appointments/:id
export const cancelAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("appointment.invalid_id", 401));
  }

  const data = await Appointment.findById(id);
  if (!data) {
    return next(new ErrorResponse("appointment.not_found", 404));
  }

  // Authorization
  const isPatient = String(data.patient) === req.user.userId;
  const isDoctor  = String(data.doctor ) === req.user.userId;
  if (!isPatient && !isDoctor && !req.user.isAdmin) {
    return next(new ErrorResponse("appointment.unothorzed", 403));
  }

  // Business rules
  const now = new Date();
  if (data.start < now) {
    return next(new ErrorResponse("appointment.cant_cancel_past", 400));
  }
  if (data.status === "cancelled") {
    return next(new ErrorResponse("appointment.already_cancelled", 400));
  }
  if (isPatient && data.status == "completed" ) {
    return next(new ErrorResponse(
      "appointment.patient_only",
      403
    ));
  }

  data.status = 'cancelled';
  await data.save();

  res.status(200).json({
    data,
    status: STATUS_CODE.SUCCESS,
    message: req.t('appointment.cancelled_successfully')
  });
});


export const getDoctors = catchAsync( async (req ,res, next) => {

  const data = await User.find({isDoctor: true, approved: true}).select("-password -emailVerifiedCode -approved -emailVerifiedCodeExpireIn -isAdmin -__v -isDoctor -isOnline -lastActive -createdAt -updatedAt");

  if(!data) {
    next(new ErrorResponse("appointment.no_doctors", 404))
  }

  return res.status(200).json({
    data,
    status: STATUS_CODE.SUCCESS,
    message: req.t('appointment.doctors_found')
  })

})