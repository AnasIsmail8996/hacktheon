import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: false,
        message: "Authorization token missing ❌",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Invalid token format ❌",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Correct check — only email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access ❌ — Not an admin",
      });
    }

    next();

  } catch (error) {
    console.error("Auth admin error:", error);

    return res.status(401).json({
      status: false,
      message: "Invalid or expired token ❌",
      error: error.message,
    });
  }
};

export { authAdmin };
