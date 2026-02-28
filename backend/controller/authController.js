import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

export const signup = async (req, res) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({
        success: false,
        message: 'All field Required'
    });
    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({
        success: false,
        message: 'All fields required'
    });
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({
            success: false,
            message: 'User not found'
        });

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) return res.status(401).json({
            success: false,
            message: 'Wrong credentials'
        });

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
}


export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been Logged out!');
    } catch (error) {
        next(error);
    }
}