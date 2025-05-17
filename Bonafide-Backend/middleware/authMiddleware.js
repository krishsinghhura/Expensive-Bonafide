const jwt = require('jsonwebtoken');
const authMiddleware = async (req,res,next) => {
     const token = req.headers.authorization?.split(' ')[1]; // Expected: "Bearer token"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
     
    try{
        const decoded = jwt.verify(token ,  process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
   catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;