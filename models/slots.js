const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    specificDate: { type: String, required: true },
    specificSlot: { type: String, required: true },
    booked: { type: Boolean }
});

module.exports = Slot = mongoose.model("slot", slotSchema);