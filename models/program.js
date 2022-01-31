const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const programSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  itemNeeded: {
    type: String,
    required: true,
  },
  qtyNeeded: {
    type: String,
    required: true,
  },
  bankAcc: {
    type: String,
    required: true,
  },
  picName: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
});

module.exports = mongoose.model("Program", programSchema);
