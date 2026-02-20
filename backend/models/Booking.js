const mongoose = require('mongoose');

/**
 * Booking Schema
 * Represents a session booking made by a user for an expert.
 * Compound unique index on { expertId, date, timeSlot } prevents double-booking.
 */
const bookingSchema = new mongoose.Schema(
    {
        expertId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expert',
            required: [true, 'Expert ID is required'],
        },
        name: { type: String, required: [true, 'Your name is required'], trim: true },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
        },
        date: { type: String, required: [true, 'Date is required'] }, // YYYY-MM-DD
        timeSlot: { type: String, required: [true, 'Time slot is required'] },
        notes: { type: String, default: '' },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Completed'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

// ✅ Compound unique index — prevents double booking for same expert+date+slot
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
