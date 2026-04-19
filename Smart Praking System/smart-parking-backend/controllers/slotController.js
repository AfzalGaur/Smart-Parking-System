const Slot = require('../models/Slot');

// Create slots (initial setup)
exports.createSlots = async (req, res) => {
    try {
        const { slots } = req.body;

        const createdSlots = await Slot.insertMany(slots);

        res.status(201).json(createdSlots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all slots
exports.getSlots = async (req, res) => {
    const slots = await Slot.find();

    const total = slots.length;
    const booked = slots.filter(s => s.status === "reserved").length;

    const demand = booked / total;

    // 🔥 AI pricing logic
    let price = 50;

    if (demand > 0.7) price = 120;
    else if (demand > 0.4) price = 80;
    else price = 50;

    // attach price
    const updatedSlots = slots.map(slot => ({
        ...slot.toObject(),
        price
    }));

    res.json(updatedSlots);
};

// Update slot status (sensor/manual)
exports.updateSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const slot = await Slot.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.json(slot);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const slots = await Slot.find({ status: 'available' });
        res.json(slots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.suggestSlot = async (req, res) => {
    try {
        const slots = await Slot.find({ status: 'available' });

        if (slots.length === 0) {
            return res.json({ message: "No slots available" });
        }

        // simple AI: pick first available
        const suggested = slots[0];

        res.json({
            message: "Best slot suggested",
            slot: suggested
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAllSlots = async (req, res) => {
    await Slot.deleteMany({});
    res.json({ message: "All slots deleted" });
};