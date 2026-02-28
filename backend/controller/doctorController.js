import mongoose from 'mongoose';
import Appointment from '../model/appointmentModel.js';
import Prescription from '../model/prescriptionModel.js';
import User from '../model/userModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get appointments for the logged-in doctor
export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'username email phone age')
            .sort({ date: 1, time: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get patient history (appointments and prescriptions)
export const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const [pastAppointments, prescriptions] = await Promise.all([
            Appointment.find({ patient: patientId }).populate('doctor', 'username'),
            Prescription.find({ patient: patientId }).populate('doctor', 'username').sort({ createdAt: -1 })
        ]);

        res.status(200).json({ pastAppointments, prescriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new prescription
export const createPrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, diagnosis, medications, notes, aiExplanation } = req.body;

        // Check if appointment exists and belongs to this doctor
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized access to this appointment" });
        }

        const newPrescription = new Prescription({
            patient: patientId,
            doctor: req.user.id,
            appointment: appointmentId,
            diagnosis,
            medications,
            notes,
            aiExplanation
        });

        await newPrescription.save();

        // Update appointment status to completed
        appointment.status = 'completed';
        await appointment.save();

        res.status(201).json({ message: "Prescription saved and appointment completed", prescription: newPrescription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAiAssistance = async (req, res) => {
    try {
        const { diagnosis, medications, query, subjective, objective } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        let prompt;
        if (query) {
            prompt = `As a medical AI assistant for doctors, answer the following follow-up question based on the provided clinical context:
            Diagnosis: ${diagnosis || 'Not yet determined'}
            Medications: ${medications ? medications.map(m => `${m.name} (${m.dosage}, ${m.duration})`).join(', ') : 'None'}
            Subjective Symptoms: ${subjective || 'Not provided'}
            Objective Findings: ${objective || 'Not provided'}
            
            Question: ${query}
            
            Keep the response concise, professional, and evidence-based.`;
        } else if (!diagnosis && (subjective || objective)) {
            prompt = `As a medical AI assistant for doctors, based on the following patient symptoms and findings, suggest 3-5 potential differential diagnoses and recommended next steps or tests.
            
            Subjective Symptoms: ${subjective}
            Objective Findings: ${objective}
            
            Format the response professionally for a physician.`;
        } else {
            prompt = `As a medical AI assistant for doctors, provide a brief, professional, and patient-friendly explanation for the following diagnosis and medications:
            Diagnosis: ${diagnosis}
            Medications: ${medications.map(m => `${m.name} (${m.dosage}, ${m.duration})`).join(', ')}
            
            Focus on how the medications help and any general advice for the patient. Keep it under 150 words.`;
        }

        const result = await model.generateContent(prompt);
        const explanation = result.response.text();

        res.status(200).json({ explanation });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate AI assistance" });
    }
};

// Get personal analytics for doctor with chart data
export const getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const today = new Date().toLocaleDateString('en-CA');

        // Basic counts
        const [totalAppointments, todayAppointments, completedPrescriptions] = await Promise.all([
            Appointment.countDocuments({ doctor: doctorId }),
            Appointment.countDocuments({ doctor: doctorId, date: today }),
            Prescription.countDocuments({ doctor: doctorId })
        ]);

        // Get appointment counts for the last 7 days for the chart
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }

        const chartData = await Promise.all(last7Days.map(async (date) => {
            const count = await Appointment.countDocuments({ doctor: doctorId, date });
            const completedCount = await Appointment.countDocuments({ doctor: doctorId, date, status: 'completed' });
            return {
                date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
                appointments: count,
                completed: completedCount
            };
        }));

        // Recently treated patients (unique)
        const recentPrescriptions = await Prescription.find({ doctor: doctorId })
            .populate('patient', 'username email age phone')
            .sort({ createdAt: -1 })
            .limit(10);

        // Diagnosis distribution (top 5)
        const diagnosisDistribution = await Prescription.aggregate([
            { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
            { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const formattedDiagnosisMix = diagnosisDistribution.map(d => ({
            name: d._id,
            value: d.count
        }));

        res.status(200).json({
            stats: {
                totalAppointments,
                todayAppointments,
                totalCompleted: completedPrescriptions
            },
            chartData,
            recentPatients: recentPrescriptions,
            diagnosisMix: formattedDiagnosisMix.length > 0 ? formattedDiagnosisMix : [
                { name: 'General', value: 100 }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search all patients in the system
export const searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json([]);

        // Search in User model for patients
        const patients = await User.find({
            role: 'patient',
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('username email phone age gender address');

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
