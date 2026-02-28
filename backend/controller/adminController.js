import User from '../model/userModel.js';
import bcryptjs from 'bcryptjs';

// Get all doctors
export const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new doctor
export const addDoctor = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ error: "Doctor already exists!" });
        }
        const newDoctor = new User({
            username,
            email,
            password: hashedPassword,
            role: 'doctor'
        });
        await newDoctor.save();
        res.status(201).json({ message: "Doctor added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a doctor
export const updateDoctor = async (req, res) => {
    try {
        const updatedDoctor = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');

        if (!updatedDoctor) return res.status(404).json({ error: "Doctor not found" });
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await User.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) return res.status(404).json({ error: "Doctor not found" });
        res.status(200).json({ message: 'Doctor deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- RECEPTIONIST MANAGEMENT ---

// Get all receptionists
export const getReceptionists = async (req, res) => {
    try {
        const receptionists = await User.find({ role: 'receptionist' }).select('-password');
        res.status(200).json(receptionists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new receptionist
export const addReceptionist = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newReceptionist = new User({
            username,
            email,
            password: hashedPassword,
            role: 'receptionist',
        });

        await newReceptionist.save();
        res.status(201).json({ message: "Receptionist added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a receptionist
export const updateReceptionist = async (req, res) => {
    try {
        const updatedReceptionist = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');

        if (!updatedReceptionist) return res.status(404).json({ error: "Receptionist not found" });
        res.status(200).json(updatedReceptionist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a receptionist
export const deleteReceptionist = async (req, res) => {
    try {
        const deletedReceptionist = await User.findByIdAndDelete(req.params.id);
        if (!deletedReceptionist) return res.status(404).json({ error: "Receptionist not found" });
        res.status(200).json({ message: 'Receptionist deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Mock analytics data
export const getAnalytics = async (req, res) => {
    try {
        const doctorCount = await User.countDocuments({ role: 'doctor' });
        const receptionistCount = await User.countDocuments({ role: 'receptionist' });
        const patientCount = await User.countDocuments({ role: 'patient' });

        res.status(200).json({
            users: {
                doctors: doctorCount,
                receptionists: receptionistCount,
                patients: patientCount,
                total: doctorCount + receptionistCount + patientCount
            },
            revenue: {
                daily: 1250.00,
                weekly: 8400.00,
                monthly: 32000.00
            },
            appointments: {
                completed: 45,
                upcoming: 12,
                cancelled: 3
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getSubscription = async (req, res) => {
    res.status(200).json({
        plan: "Pro",
        status: "Active",
        billingCycle: "Monthly",
        nextBillingDate: "2026-03-28",
        price: 199.00
    });
};

export const updateSubscription = async (req, res) => {
    const { plan } = req.body;
    res.status(200).json({
        message: `Successfully updated subscription to ${plan} plan!`,
        plan: plan,
        status: "Active"
    });
};

// --- SYSTEM USAGE (Mocked) ---
export const getSystemUsage = async (req, res) => {
    res.status(200).json({
        storage: {
            usedStr: "12 GB",
            totalStr: "50 GB",
            percentage: 24
        },
        aiTokens: {
            used: 125000,
            limit: 500000,
            percentage: 25
        },
        smsCredits: {
            used: 85,
            limit: 1000,
            percentage: 8.5
        }
    });
};
