import express from 'express';
import {
    getDoctorAppointments,
    getPatientHistory,
    createPrescription,
    getAiAssistance,
    getDoctorStats,
    searchPatients
} from '../controller/doctorController.js';
import { verifyToken } from '../middleware/verifyUser.js';

const doctorRouter = express.Router();

// Role-based protection should ideally be added as well (verifyRole('doctor'))
// For now, using verifyToken as a baseline, but assuming integration with a role check.

doctorRouter.get('/appointments', verifyToken, getDoctorAppointments);
doctorRouter.get('/patient-history/:patientId', verifyToken, getPatientHistory);
doctorRouter.post('/prescription', verifyToken, createPrescription);
doctorRouter.post('/ai-assist', verifyToken, getAiAssistance);
doctorRouter.get('/search-patients', verifyToken, searchPatients);
doctorRouter.get('/stats', verifyToken, getDoctorStats);

export default doctorRouter;
