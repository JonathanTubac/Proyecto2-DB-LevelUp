export class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
    }
}

export class NotFoundError extends AppError {
    constructor(msg = 'Not found') {
        super(msg, 404, 'NOT_FOUND');
    }
}

export class ConfictError extends AppError {
    constructor(msg) {
        super(msg, 409, 'CONFLICT');
    }
}

export class UnauthorizedError extends AppError {
    constructor(msg = 'Unauthorized') {
        super(msg, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(msg = 'Forbidden') {
        super(msg, 403, 'FORBIDDEN');
    }
}

export class ValidationError extends AppError {
    constructor(msg) {
        super(msg, 422, 'VALIDATION_ERROR');
    }
}