import Appointment from "../model/appointmentModel.js";
import Prescription from "../model/prescriptionModel.js";
import User from "../model/userModel.js";

// Get personal stats for the patient dashboard
export const getPatientStats = async (req, res) => {
    try {
        const patientId = req.user.id;

        const [appointmentCount, prescriptionCount, nextAppointment] = await Promise.all([
            Appointment.countDocuments({ patient: patientId }),
            Prescription.countDocuments({ patient: patientId }),
            Appointment.findOne({
                patient: patientId,
                status: 'scheduled',
                date: { $gte: new Date().toLocaleDateString('en-CA') }
            }).populate('doctor', 'username').sort({ date: 1, time: 1 })
        ]);

        res.status(200).json({
            stats: {
                totalAppointments: appointmentCount,
                totalPrescriptions: prescriptionCount,
            },
            nextAppointment,
            profile: await User.findById(patientId).select('-password')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all appointments for the patient
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'username email')
            .sort({ date: -1, time: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all prescriptions for the patient
export const getMyPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id })
            .populate('doctor', 'username email')
            .populate('appointment', 'date time reason')
            .sort({ createdAt: -1 });
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
