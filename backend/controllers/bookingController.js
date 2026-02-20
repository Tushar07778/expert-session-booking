const Booking = require('../models/Booking');

/**
 * @desc  Create a new booking
 * @route POST /api/bookings
 * Emits 'slot_booked' socket event on success.
 * The unique index on { expertId, date, timeSlot } prevents double-booking.
 */
const createBooking = async (req, res, next) => {
    try {
        const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

        // Verify the expert exists
        const Expert = require('../models/Expert');
        const expert = await Expert.findById(expertId);
        if (!expert) {
            const err = new Error('Expert not found');
            err.statusCode = 404;
            return next(err);
        }

        // Create the booking — will throw if duplicate (unique index violation)
        const booking = await Booking.create({ expertId, name, email, phone, date, timeSlot, notes });

        // ✅ Emit real-time event to all connected clients
        const io = req.app.get('io');
        io.emit('slot_booked', {
            expertId,
            date,
            timeSlot,
            bookingId: booking._id,
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully!',
            data: booking,
        });
    } catch (error) {
        // MongoDB duplicate key error → double booking attempt
        if (error.code === 11000) {
            const dupErr = new Error('This time slot is already booked. Please choose another slot.');
            dupErr.statusCode = 409;
            return next(dupErr);
        }
        next(error);
    }
};

/**
 * @desc  Update booking status
 * @route PATCH /api/bookings/:id/status
 */
const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Pending', 'Confirmed', 'Completed'];

        if (!allowedStatuses.includes(status)) {
            const err = new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
            err.statusCode = 400;
            return next(err);
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            const err = new Error('Booking not found');
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc  Get bookings by email
 * @route GET /api/bookings?email=
 */
const getBookingsByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        if (!email) {
            const err = new Error('Email query parameter is required');
            err.statusCode = 400;
            return next(err);
        }

        const bookings = await Booking.find({ email: email.toLowerCase() })
            .populate('expertId', 'name category photo')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, updateBookingStatus, getBookingsByEmail };
