const mongoose = require('mongoose');

/**
 * Expert Schema
 * Represents an expert available for booking sessions.
 */
const availableSlotSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    slots: [{ type: String }],              // e.g. ["09:00 AM", "10:00 AM"]
});

const expertSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Expert name is required'], trim: true },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Technology', 'Design', 'Marketing', 'Finance', 'Health', 'Education', 'Legal', 'Business'],
        },
        bio: { type: String, default: '' },
        experience: { type: Number, required: true, min: 0 }, // years
        rating: { type: Number, required: true, min: 0, max: 5, default: 4.0 },
        photo: { type: String, default: '' },
        availableSlots: [availableSlotSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expert', expertSchema);
