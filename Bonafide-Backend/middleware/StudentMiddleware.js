// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyStudentToken = (req, res, next) => {
  const token = req.cookies.StudentToken || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded; // contains student id or email from token
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyStudentToken;
