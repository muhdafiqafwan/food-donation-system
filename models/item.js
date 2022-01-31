const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const itemSchema = new Schema({
  food: [foodSchema],
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  remarks: {
    type: String,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
  },
  donor: {
    type: Schema.Types.ObjectId,
    ref: "Donor",
  },
});

module.exports = mongoose.model("Item", itemSchema);
