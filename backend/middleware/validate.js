const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating a new booking.
 */
const bookingValidationRules = [
    body('expertId').notEmpty().withMessage('Expert ID is required'),
    body('name').trim().notEmpty().withMessage('Your name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('phone')
        .matches(/^\d{10}$/)
        .withMessage('Phone number must be exactly 10 digits'),
    body('date').notEmpty().withMessage('Date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
];

/**
 * Middleware to check validation results.
 * Returns 422 with error details if validation fails.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }
    next();
};

module.exports = { bookingValidationRules, validate };
