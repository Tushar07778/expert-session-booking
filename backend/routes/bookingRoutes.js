const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getBookingsByEmail } = require('../controllers/bookingController');
const { bookingValidationRules, validate } = require('../middleware/validate');

// GET /api/bookings?email= - Get bookings by email
router.get('/', getBookingsByEmail);

// POST /api/bookings - Create booking (with input validation)
router.post('/', bookingValidationRules, validate, createBooking);

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
