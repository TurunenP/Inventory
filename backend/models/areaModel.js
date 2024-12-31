const mongoose = require("mongoose");

const barsSchema = new mongoose.Schema({
  name: String,
});

const contentSchema = new mongoose.Schema({
  name: String,
});

const doorSchema = new mongoose.Schema({
  name: String,
});

const categorySchema = new mongoose.Schema({
  name: String,
  doors: [doorSchema],
});

const cabinetSchema = new mongoose.Schema({
  name: String,
  categories: [categorySchema],
});

const shelfSchema = new mongoose.Schema({
  name: String,
  bars: [barsSchema],
});

const binSchema = new mongoose.Schema({
  name: String,
  contents: [contentSchema],
});

const areaSchema = new mongoose.Schema({
  area_name: String,
  cabinets: [cabinetSchema],
  shelves: [shelfSchema],
  bins: [binSchema],
});

const AreaModel = mongoose.model("Area", areaSchema);

const cabinetModel = mongoose.model("Cabinet", cabinetSchema);

const binModel = mongoose.model("Bin", binSchema);

module.exports = {
  AreaModel,
  cabinetModel,
  binModel,
};
