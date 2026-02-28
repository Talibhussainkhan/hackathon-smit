import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // format: YYYY-MM-DD
        required: true
    },
    time: {
        type: String, // format: HH:mm
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    reason: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
