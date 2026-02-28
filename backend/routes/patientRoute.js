import express from 'express';
import { verifyToken } from '../middleware/verifyUser.js';
import {
    getPatientStats,
    getMyAppointments,
    getMyPrescriptions
} from '../controller/patientController.js';

const router = express.Router();

// All routes are protected and scoped to the logged-in patient
router.get('/stats', verifyToken, getPatientStats);
router.get('/my-appointments', verifyToken, getMyAppointments);
router.get('/my-prescriptions', verifyToken, getMyPrescriptions);

export default router;
