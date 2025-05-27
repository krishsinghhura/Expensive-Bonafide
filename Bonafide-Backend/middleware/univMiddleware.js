const jwt = require("jsonwebtoken");

const univMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;


  try {
    const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzNmOTZkNDFhOTNlNjNlMDY1MGIwMSIsImlhdCI6MTc0ODI3OTkzNiwiZXhwIjoxNzQ4MzY2MzM2fQ.UP-2hPNrvLf8RiVug7kR8WIxGTkJJr432vtMYHTTNLg", process.env.JWT_SECRET);
    req.user = decoded; // Add user info to req object
    console.log(req.user);
    
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.log(error);
    
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = univMiddleware;
