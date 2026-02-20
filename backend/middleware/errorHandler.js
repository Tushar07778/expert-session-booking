/**
 * Centralized error handling middleware.
 * Returns a consistent JSON error response.
 */
const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);

    // Handle MongoDB duplicate key error (double booking)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'This time slot is already booked. Please choose a different slot.',
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // Handle invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
