const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const user = await User.create({
            email,
            password: hashedPassword,
        });

        // Respond with user info (excluding password)
        res.status(201).json({
            success: true,
            _id: user._id,
            email: user.email,
            createdAt: user.createdAt,
        });
    } 
    catch(err){
        console.error(`Error: ${err.message}`);
        res.status(501).json({
            success: false,
            message: "Server error",
        });
    }
};

// Login user and set JWT cookies
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials, please try again",
            });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Set tokens in HttpOnly cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 60 * 1000 // 30 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Respond with user info
        res.status(200).json({
            message: "Logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
            }
        });
    } 
    catch(err){
        console.error(`Error: ${err.message}`);
        res.status(501).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Get logged-in user's profile
exports.getUserProfile = (req, res) => {
    // 'protect' middleware attaches user to req.user
    res.status(200).json(req.user);
};

// Logout user and clear cookies
exports.logoutUser = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
};