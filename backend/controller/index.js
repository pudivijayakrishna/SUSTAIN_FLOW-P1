import User from '../models/user.js';
import { generateToken } from '../config/jwtUtils.js';
import sendMail from '../utils/mailer.js'; // Import the sendMail function

// Signup controller
export const signup = async (req, res) => {
    try {
        let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (user) {
            console.log("User already exists!"); // Log message if user already exists
            return res.status(409).json({ error: 'User already exists!' });
        }
        
        user = await User.create(req.body);
        console.log("User created successfully!");

        // Send a welcome email after the user is successfully created
        const welcomeMessage = "Welcome to SustainFlow, We drive towards sustainability. Happy to have you as a member.";
        await sendMail(user.email, 'Welcome to SustainFlow!', welcomeMessage);

        return res.status(201).json({ message: 'User created successfully!' });

    } catch (error) {
        console.log("Error during signup: ", error.message);
        return res.status(500).send({ error: error.message });
    }
};

// Create session (login) controller
export const create_session = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;
        let user = await User.findOne({ $or: [{ email: emailUsername }, { username: emailUsername }] });
        
        if (!user || password !== user.password) {
            console.log("Invalid Email/Username or Password!");
            return res.status(401).json({ error: 'Invalid Email/Username or Password!' });
        }

        const token = generateToken(user);
        console.log("Session created successfully!");

        return res.status(200).json({ token: token, role: user.role });

    } catch (error) {
        console.log("Error during session creation: ", error);
        return res.status(500).json({ error: error.message });
    }
};

// Profile controller
export const profile = async (req, res) => {
    try {
        let user = await User.findById(req.user.id, { name: 1, username: 1, email: 1, role: 1, contact: 1, address: 1, location: 1 });
        if (!user) {
            console.log("User not found!");
            return res.status(404).json({ message: 'User not found!' });
        }
        console.log("User profile found!");
        return res.status(200).json({ message: 'User found!', user: user });

    } catch (error) {
        console.log("Error fetching profile: ", error);
        return res.status(500).json({ error: error.message });
    }
};

// Update user profile controller
export const update_profile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            { _id: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            console.log("User not found for update!");
            return res.status(404).json({ message: 'User not found!' });
        }
        console.log("User profile updated!");
        return res.status(200).json({ message: 'User data updated!', user: updatedUser });

    } catch (error) {
        console.log("Error updating profile: ", error);
        return res.status(500).json({ error: error.message });
    }
};
