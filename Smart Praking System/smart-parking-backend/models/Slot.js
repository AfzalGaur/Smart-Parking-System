const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber: {
        type: String,
        required: true,
        unique: true
    },
    price: {
    type: Number,
    default: 50
},
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved'],
        default: 'available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);