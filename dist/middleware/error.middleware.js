export const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack,
        cause: err.cause
    });
};
