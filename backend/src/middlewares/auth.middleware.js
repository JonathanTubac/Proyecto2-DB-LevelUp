import { verifyToken } from "../utils/jwt.js";
import * as userRepo from '../repositories/user.repository.js';
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError('Not authorized');

        const decoded = verifyToken(token, process.env.JWT_SECRET);

        const user = await userRepo.findById(decoded.userId);
        if (!user) throw new UnauthorizedError('User not found!');

        req.user = {
            ...user,
            carnet: decoded.carnet ?? null
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return next(new UnauthorizedError('Expired token'))
        if (err.name === 'JsonWebTokenError')
            return next(new UnauthorizedError('Invalid token'))
        next(err)
    }
}

export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol))
        return next(new ForbiddenError('You dont have authorization for that'));
    next();
}