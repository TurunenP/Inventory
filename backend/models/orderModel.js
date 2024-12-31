const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  equipment_type: {
    type: String,
    required: true,
    trim: true,
  },
  equipment_room: {
    type: String,
    trim: true,
  },
  equipment_location: {
    type: String,
    trim: true,
  },
  equipment_category: {
    type: String,
    trim: true,
  },
  total_quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  current_quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
