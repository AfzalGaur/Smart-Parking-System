const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    user: {
        type: String, // later we’ll replace with user model
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000)
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);