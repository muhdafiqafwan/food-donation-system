const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  bankAcc: {
    type: String,
    required: true,
  },
  bankAcc: {
    type: String,
    required: true,
  },
  verified: {
    type: String,
    required: true,
    default: "Pending",
  },
  createdPrograms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
  ],
  longLat: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

module.exports = mongoose.model("Organization", organizationSchema);
