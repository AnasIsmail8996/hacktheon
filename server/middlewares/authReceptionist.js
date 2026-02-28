import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";

export const authReceptionist = async (req, res, next) => {
    try {
        const token =
            req.headers["rtoken"] || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ status: false, message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "receptionist") {
            return res.status(403).json({ status: false, message: "Access denied. Receptionist role required." });
        }

        req.user = { userId: user._id };
        next();
    } catch (error) {
        return res.status(401).json({ status: false, message: "Invalid or expired token.", error: error.message });
    }
};
