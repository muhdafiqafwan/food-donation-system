const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Donor = require("../../models/donor");
const { transformDonor } = require("./merge");
const { createTokensDonor } = require("./createTokens");
// let pinGlobal;

module.exports = {
  donors: async () => {
    try {
      const fetchedDonor = await Donor.find();
      return fetchedDonor.map((donor) => {
        return transformDonor(donor);
      });
    } catch (err) {
      throw err;
    }
  },
  oneDonor: async (args) => {
    try {
      const fetchedDonor = await Donor.findById(args.donorId);
      return transformDonor(fetchedDonor);
    } catch (err) {
      throw err;
    }
  },
  meDonor: async (args, { req, errorName }) => {
    if (!req.donorId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedDonor = await Donor.findById(req.donorId);
      return transformDonor(fetchedDonor);
    } catch (err) {
      throw err;
    }
  },
  createDonor: async (args, { res, errorName }) => {
    try {
      const fetchedDonor = await Donor.findOne({
        email: args.donorInput.email,
      });
      if (fetchedDonor) {
        throw new Error(errorName.DONOR_EXIST);
      }
      const hashedPassword = await bcrypt.hash(args.donorInput.password, 12);
      const longLat = args.donorInput.longLat.split(","); // split latLong to assign into coordinates geoJson
      const donor = new Donor({
        email: args.donorInput.email,
        password: hashedPassword,
        firstName: args.donorInput.firstName,
        lastName: args.donorInput.lastName,
        phone: args.donorInput.phone,
        longLat: {
          type: "Point",
          coordinates: [longLat[0], longLat[1]], // [Long,Lat] - mongoose format
        },
      });
      const result = await donor.save();
      const { accessToken } = createTokensDonor(donor);
      return {
        donorId: result.id,
        email: result.email,
        accessToken: accessToken,
      };
    } catch (err) {
      throw err;
    }
  },
  loginDonor: async ({ email, password }, { res, errorName }) => {
    try {
      const fetchedDonor = await Donor.findOne({ email: email });
      if (!fetchedDonor) {
        throw new Error(errorName.DONOR_NOT_EXIST);
      }
      const isEqual = await bcrypt.compare(password, fetchedDonor.password);
      if (!isEqual) {
        throw new Error(errorName.INVALID_PASSWORD);
      }
      const { accessToken } = createTokensDonor(fetchedDonor);
      return {
        donorId: fetchedDonor.id,
        accessToken: accessToken,
        email: fetchedDonor.email,
        longLat: String(fetchedDonor.longLat.coordinates),
      };
    } catch (err) {
      throw err;
    }
  },
  updateDonor: async (args, { req, errorName }) => {
    try {
      const fetchedDonors = await Donor.findById(args.donorId);
      if (!fetchedDonors) {
        throw new Error(errorName.DONOR_NOT_FOUND);
      }
      const query = { _id: args.donorId };
      const newValue = {};
      if (args.donorInput.firstName) {
        newValue.firstName = args.donorInput.firstName;
      }
      if (args.donorInput.lastName) {
        newValue.lastName = args.donorInput.lastName;
      }
      if (args.donorInput.phone) {
        newValue.phone = args.donorInput.phone;
      }
      if (args.donorInput.email) {
        const fetchedDonor = await Donor.findOne({
          email: args.donorInput.email,
        });
        const emptyDonor = {};
        if (fetchedDonor == null) {
          emptyDonor.email = "erts";
        } else {
          emptyDonor.email = fetchedDonor.email;
        }
        if (fetchedDonor && !(emptyDonor.email == req.email)) {
          throw new Error(errorName.EMAIL_TAKEN);
        }
        newValue.email = args.donorInput.email;
      }
      if (args.donorInput.longLat) {
        const longLat = args.donorInput.longLat.split(","); // split latLong to assign into coordinates geoJson
        newValue.longLat = {
          type: "Point",
          coordinates: [longLat[0], longLat[1]], // [Long,Lat] - mongoose format
        };
      }
      const updatingDonor = await Donor.findByIdAndUpdate(
        query,
        { $set: newValue },
        { new: true }
      );
      return transformDonor(updatingDonor);
    } catch (err) {
      throw err;
    }
  },
};
