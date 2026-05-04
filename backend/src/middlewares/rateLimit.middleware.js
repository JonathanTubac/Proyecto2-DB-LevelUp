import rateLimit from 'express-rate-limit';
import { success } from 'zod';
import { tr } from 'zod/v4/locales';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: { message: 'Too many requests!' }

    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: { message: 'Too many tries, try it later!' }
    },
    standardHeaders: true,
    legacyHeaders: false,
});