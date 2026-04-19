const express = require('express');
const router = express.Router();
const {
    createSlots,
    getSlots,
    updateSlot,
    getAvailableSlots,
    suggestSlot,
    deleteAllSlots
} = require('../controllers/slotController');

router.post('/create', createSlots);
router.get('/', getSlots);
router.put('/:id', updateSlot);
router.get('/available', getAvailableSlots);
router.get('/suggest', suggestSlot);
router.delete('/all', deleteAllSlots);

module.exports = router;