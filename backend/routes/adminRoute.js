import express from 'express';
import {
    addDoctor,
    addReceptionist,
    deleteDoctor,
    deleteReceptionist,
    getAnalytics,
    getDoctors,
    getReceptionists,
    getSubscription,
    getSystemUsage,
    updateDoctor,
    updateReceptionist,
    updateSubscription
} from '../controller/adminController.js';

const adminRouter = express.Router();

// Doctor Routes
adminRouter.get('/doctors', getDoctors);
adminRouter.post('/doctors', addDoctor);
adminRouter.put('/doctors/:id', updateDoctor);
adminRouter.delete('/doctors/:id', deleteDoctor);

// Receptionist Routes
adminRouter.get('/receptionists', getReceptionists);
adminRouter.post('/receptionists', addReceptionist);
adminRouter.put('/receptionists/:id', updateReceptionist);
adminRouter.delete('/receptionists/:id', deleteReceptionist);

// Analytics & Dashboard Routes
adminRouter.get('/analytics', getAnalytics);
adminRouter.get('/subscription', getSubscription);
adminRouter.put('/subscription', updateSubscription);
adminRouter.get('/usage', getSystemUsage);

export default adminRouter;
