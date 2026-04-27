export default (err, req, res, next) => {
    const status = err.statusCode || 500;

    req.status(status).json({
        success: false,
        error: {
            code: err.code || 'SERVER_ERROR',
            message: err.isOperational ? err.message : 'Internal server error'
        }
    });
};