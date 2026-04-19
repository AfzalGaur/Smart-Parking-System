const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const fs = require("fs");

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createBooking = async (req, res) => {
    try {
        const { slotId } = req.body;

        const slot = await Slot.findById(slotId);

        if (!slot || slot.status !== "available") {
            return res.status(400).json({ error: "Slot not available" });
        }

        const booking = await Booking.create({
            slot: slotId,
            user: req.user   // 🔥 from token
        });

        slot.status = "reserved";
        await slot.save();

        fs.appendFileSync("logs/bookings.txt",
            `BOOKED: ${req.user} -> Slot ${slotId} at ${new Date()}\n`
        );

        res.status(201).json(booking);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

setInterval(async () => {
    const expiredBookings = await Booking.find({
        endTime: { $lt: new Date() }
    });

    for (let booking of expiredBookings) {
        await Slot.findByIdAndUpdate(booking.slot, {
            status: 'available'
        });

        await Booking.findByIdAndDelete(booking._id);
    }

    console.log("Expired bookings cleaned");
}, 60000); // runs every 1 min

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // 🚫 Prevent other users
        if (booking.user.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Slot.findByIdAndUpdate(booking.slot, {
            status: "available"
        });

        await Booking.findByIdAndDelete(req.params.id);

        fs.appendFileSync("logs/bookings.txt",
            `CANCELLED: ${req.user} -> Booking ${id} at ${new Date()}\n`
        );

        res.json({ message: "Cancelled" });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};