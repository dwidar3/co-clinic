import { Router } from 'express';
import verifyToken from '../utils/verifyUser.js';
import {
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getDoctors,
  createAppointmentPaymentIntent,
  verifyAppointmentPayment,
  createAppointmentCheckoutSession
} from '../controllers/appointment.js';
import verifyDoctor from '../middleware/doctorMiddleware.js';

const router = Router();

// Patients
router.post('/create-payment-intent', verifyToken, createAppointmentPaymentIntent); // New payment endpoint
router.post('/create-checkout-session', verifyToken, createAppointmentCheckoutSession);

router.post('/verify-payment', verifyToken, verifyAppointmentPayment); // Payment verification
router.get('/patient-appointments', verifyToken, getPatientAppointments);
router.get('/doctors', getDoctors);

// Doctors
router.get('/doctor-appointments', verifyToken, verifyDoctor, getDoctorAppointments);
router.put('/status/:id', verifyToken, updateAppointmentStatus);
router.delete('/delete/:id', verifyToken, cancelAppointment);

export default router;