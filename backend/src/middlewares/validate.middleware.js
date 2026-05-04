import { ValidationError } from "../utils/errors.js";

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
        const errors = result.error?.errors ?? [];
        console.log('[validate] errors:', JSON.stringify(errors));
        const message = errors
            .map(e => `${e.path.join('.') || 'campo'}: ${e.message}`)
            .join(', ');

        return next(new ValidationError(message || 'Datos inválidos'));
    }

    req.body = result.data;
    next();
};