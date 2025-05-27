const jwt = require("jsonwebtoken");

const univMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

console.log(authHeader);


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("token is", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzNmOTZkNDFhOTNlNjNlMDY1MGIwMSIsImlhdCI6MTc0ODI3OTkzNiwiZXhwIjoxNzQ4MzY2MzM2fQ.UP-2hPNrvLf8RiVug7kR8WIxGTkJJr432vtMYHTTNLg", process.env.JWT_SECRET);
    req.user = decoded; // Add user info to req object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = univMiddleware;
