import express from 'express';
import {
    registerPatient,
    bookAppointment,
    updatePatient,
    getDailySchedule,
    getPatients,
    getDoctors,
    updateAppointmentStatus
} from '../controller/receptionistController.js';
import { verifyToken } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/register-patient', verifyToken, registerPatient);
router.post('/book-appointment', verifyToken, bookAppointment);
router.put('/update-patient/:id', verifyToken, updatePatient);
router.get('/schedule', verifyToken, getDailySchedule);
router.get('/patients', verifyToken, getPatients);
router.get('/doctors', verifyToken, getDoctors);
router.put('/appointment-status/:id', verifyToken, updateAppointmentStatus);

export default router;
