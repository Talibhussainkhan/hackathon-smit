import User from "../model/userModel.js";
import Appointment from "../model/appointmentModel.js";
import bcryptjs from 'bcryptjs';

// Register a new patient
export const registerPatient = async (req, res) => {
    try {
        const { username, email, password, phone, age } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newPatient = new User({
            username,
            email,
            password: hashedPassword,
            role: 'patient',
            phone,
            age
        });

        await newPatient.save();
        res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, reason } = req.body;

        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            time,
            reason
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update patient info
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPatient = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        ).select('-password');

        if (!updatedPatient) return res.status(404).json({ error: "Patient not found" });
        res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all patients
export const getPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' }).select('-password');
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all doctors (for selection)
export const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get daily schedule
export const getDailySchedule = async (req, res) => {
    try {
        const { date } = req.query; // format: YYYY-MM-DD
        const queryDate = date || new Date().toLocaleDateString('en-CA');

        const appointments = await Appointment.find({ date: queryDate })
            .populate('patient', 'username email phone')
            .populate('doctor', 'username email');

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'scheduled', 'completed', 'cancelled'

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );

        if (!updatedAppointment) return res.status(404).json({ error: "Appointment not found" });
        res.status(200).json({ message: `Appointment marked as ${status}`, appointment: updatedAppointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
