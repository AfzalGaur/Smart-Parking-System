const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createBooking,
        cancelBooking,
        getBookings
 } = require('../controllers/bookingController');

router.get('/', getBookings);
router.post("/", auth, createBooking);
router.delete("/:id", auth, cancelBooking);

module.exports = router;