const jwt = require('jsonwebtoken');

const univMiddleware = (req, res, next) => {
    console.log(req.cookies);
    
const token = req.cookies.token; // ✅ This will now be present
console.log("Token from middleware",token);
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, "supersecretkey");
        req.user = decoded; 
        console.log(req.user);
        console.log("middleware passed");
         // Add user info to req object
        next();  // Proceed to next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = univMiddleware;
 