import jwt from "jsonwebtoken";

export const authDoctor = (req, res, next) => {
    try {
        const token =
            req.headers["dtoken"] || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Access denied. No doctor token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded.doctorId) {
            return res.status(403).json({
                status: false,
                message: "Invalid doctor token.",
            });
        }

        req.doctor = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid or expired token.",
            error: error.message,
        });
    }
};
