const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes using JWT authentication
exports.protect = async (req, res, next) => {
    let token;

    // Read JWT from httpOnly cookie
    if (req.cookies && req.cookies.accessToken){
        try{
            token = req.cookies.accessToken;

            // Verify token and decode payload
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // Attach user (without password) to request object
            req.user = await User.findById(decoded.id).select("-password");

            if(req.user){
                next(); // User found, proceed
            } 
            else{
                return res.status(401).json({
                    message: "Not authorized, user not found"
                });
            }
        } 
        catch (err){
            console.error(err);
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed",
            });
        }
    }

    // No token found
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Not authorized, token missing"
        });
    }
};