import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import logger from '../config/logger.js';

export const verifyToken = async (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
    } catch (error) {
    logger.error(`Token verification error: ${error.message}`);
    return res.status(401).json({ message: 'Unauthorized' });
    }
};
  
// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access is denied' });
    }
    next();
    };
};