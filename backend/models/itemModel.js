const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  item_type: {
    type: String,
    required: true,
    trim: true,
  },
  item_room: {
    type: String,
    trim: true,
  },
  item_location: {
    type: String,
    trim: true,
  },
  item_category: {
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

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
