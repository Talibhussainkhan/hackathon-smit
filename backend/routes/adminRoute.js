import express from 'express';
import {
    addDoctor,
    addReceptionist,
    deleteDoctor,
    deleteReceptionist,
    getAnalytics,
    getDoctors,
    getDoctorById,
    getReceptionists,
    getReceptionistById,
    getSubscription,
    getSystemUsage,
    updateDoctor,
    updateReceptionist,
    updateSubscription
} from '../controller/adminController.js';
import { verifyToken } from '../middleware/verifyUser.js';

const adminRouter = express.Router();

adminRouter.use(verifyToken);

// Doctor Routes
adminRouter.get('/doctors', getDoctors);
adminRouter.get('/doctors/:id', getDoctorById);
adminRouter.post('/doctors', addDoctor);
adminRouter.put('/doctors/:id', updateDoctor);
adminRouter.delete('/doctors/:id', deleteDoctor);

// Receptionist Routes
adminRouter.get('/receptionists', getReceptionists);
adminRouter.get('/receptionists/:id', getReceptionistById);
adminRouter.post('/receptionists', addReceptionist);
adminRouter.put('/receptionists/:id', updateReceptionist);
adminRouter.delete('/receptionists/:id', deleteReceptionist);

// Analytics & Dashboard Routes
adminRouter.get('/analytics', getAnalytics);
adminRouter.get('/subscription', getSubscription);
adminRouter.put('/subscription', updateSubscription);
adminRouter.get('/usage', getSystemUsage);

export default adminRouter;
