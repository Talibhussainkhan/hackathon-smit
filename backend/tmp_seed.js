import mongoose from 'mongoose';
import User from './model/userModel.js';
import Appointment from './model/appointmentModel.js';
import 'dotenv/config';

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const doctor = await User.findOne({ username: 'owais', role: 'doctor' });
        const patient = await User.findOne({ role: 'patient' }) || await User.findOne({ role: 'receptionist' }); // fallback if no patient

        if (!doctor || !patient) {
            console.error("Doctor or Patient not found");
            process.exit(1);
        }

        const today = new Date().toLocaleDateString('en-CA');

        const appointments = [
            {
                patient: patient._id,
                doctor: doctor._id,
                date: today,
                time: "10:30",
                reason: "Follow-up checkup",
                status: 'scheduled'
            },
            {
                patient: patient._id,
                doctor: doctor._id,
                date: today,
                time: "11:45",
                reason: "Blood report discussion",
                status: 'scheduled'
            },
            {
                patient: patient._id,
                doctor: doctor._id,
                date: today,
                time: "14:15",
                reason: "Mild fever and cough",
                status: 'scheduled'
            }
        ];

        await Appointment.insertMany(appointments);
        console.log("Successfully seeded 3 appointments for today!");

        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
}

seed();
