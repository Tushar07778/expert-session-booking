const Expert = require('../models/Expert');

/**
 * @desc  Get all experts with pagination, search, and category filter
 * @route GET /api/experts
 * @query page, limit, search, category
 */
const getExperts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.category && req.query.category !== 'All') {
            filter.category = req.query.category;
        }

        const [experts, total] = await Promise.all([
            Expert.find(filter).select('-availableSlots').skip(skip).limit(limit).sort({ rating: -1 }),
            Expert.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: experts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalExperts: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc  Get a single expert by ID (with booked slots info merged)
 * @route GET /api/experts/:id
 */
const getExpertById = async (req, res, next) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) {
            const err = new Error('Expert not found');
            err.statusCode = 404;
            return next(err);
        }

        // Fetch all bookings for this expert to know which slots are taken
        const Booking = require('../models/Booking');
        const bookings = await Booking.find({ expertId: req.params.id }).select('date timeSlot -_id');

        // Build a Set of "date|timeSlot" strings for fast lookup
        const bookedSet = new Set(bookings.map((b) => `${b.date}|${b.timeSlot}`));

        // Annotate available slots with isBooked flag
        const annotatedSlots = expert.availableSlots.map((daySlot) => ({
            date: daySlot.date,
            slots: daySlot.slots.map((slot) => ({
                slot,
                isBooked: bookedSet.has(`${daySlot.date}|${slot}`),
            })),
        }));

        res.status(200).json({
            success: true,
            data: { ...expert.toObject(), availableSlots: annotatedSlots },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getExperts, getExpertById };
