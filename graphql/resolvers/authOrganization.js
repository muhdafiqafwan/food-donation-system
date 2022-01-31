const bcrypt = require("bcryptjs");
const Organization = require("../../models/organization");
const Donor = require("../../models/donor");
const { transformOrganization } = require("./merge");
const { createTokensOrganization } = require("./createTokens");
const loadash = require("lodash");

module.exports = {
  organizations: async () => {
    try {
      const fetchedOrg = await Organization.find();
      return fetchedOrg.map((org) => {
        return transformOrganization(org);
      });
    } catch (err) {
      throw err;
    }
  },
  countUsers: async () => {
    try {
      const fetchedOrg = await Organization.find().count();
      const fetchedDonor = await Donor.find().count();
      return {
        countOrg: String(fetchedOrg),
        countDonor: String(fetchedDonor),
      };
    } catch (err) {
      throw err;
    }
  },
  nearOrganizations: async (args, res) => {
    try {
      const fetchedOrg = await Organization.find({
        "longLat.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [args.longitude, args.latitude],
            },
            $maxDistance: args.maxDistance,
          },
        },
      });
      return fetchedOrg.map((org) => {
        return transformOrganization(org);
      });
    } catch (err) {
      throw err;
    }
  },
  oneOrganization: async (args) => {
    try {
      const fetchedOrg = await Organization.findById(args.organizationId);
      return transformOrganization(fetchedOrg);
    } catch (err) {
      throw err;
    }
  },
  meOrganization: async (args, { req, errorName }) => {
    try {
      const fetchedOrg = await Organization.findById(req.organizationId);
      return transformOrganization(fetchedOrg);
    } catch (err) {
      throw err;
    }
  },
  createOrganization: async (args, { res, errorName }) => {
    try {
      const fetchedOrg = await Organization.findOne({
        email: args.organizationInput.email,
      });
      if (fetchedOrg) {
        throw new Error(errorName.ORGANIZATION_EXIST);
      }
      const hashedPassword = await bcrypt.hash(
        args.organizationInput.password,
        12
      );
      const longLat = args.organizationInput.longLat.split(","); // split latLong to assign into coordinates geoJson
      const org = new Organization({
        name: args.organizationInput.name,
        email: args.organizationInput.email,
        password: hashedPassword,
        phone: args.organizationInput.phone,
        description: args.organizationInput.description,
        contactPerson: args.organizationInput.contactPerson,
        bankAcc: args.organizationInput.bankAcc,
        longLat: {
          type: "Point",
          coordinates: [longLat[0], longLat[1]], // [Long,Lat] - mongoose format
        },
      });
      const result = await org.save();
      const { accessToken } = createTokensOrganization(org);
      return {
        organizationId: result.id,
        name: result.name,
        accessToken: accessToken,
        email: result.email,
      };
    } catch (err) {
      throw err;
    }
  },
  loginOrganization: async ({ email, password }, { res, errorName }) => {
    try {
      const fetchedOrg = await Organization.findOne({ email: email });
      if (!fetchedOrg) {
        throw new Error(errorName.ORGANIZATION_NOT_EXIST);
      }
      const isEqual = await bcrypt.compare(password, fetchedOrg.password);
      if (!isEqual) {
        throw new Error(errorName.INVALID_PASSWORD);
      }
      const pendingOrg = await Organization.findOne({ verified: "Pending" });
      if (pendingOrg) {
        throw new Error(errorName.ORGANIZATION_PENDING);
      }
      const rejectedOrg = await Organization.findOne({ verified: "Rejected" });
      if (rejectedOrg) {
        throw new Error(errorName.ORGANIZATION_REJECTED);
      }
      const { accessToken } = createTokensOrganization(fetchedOrg);
      return {
        organizationId: fetchedOrg.id,
        name: fetchedOrg.name,
        accessToken: accessToken,
        email: fetchedOrg.email,
      };
    } catch (err) {
      throw err;
    }
  },
  updateOrganization: async (args, { req, errorName }) => {
    try {
      const fetchedOrgs = await Organization.findById(args.organizationId);
      if (!fetchedOrgs) {
        throw new Error(errorName.ORGANIZATION_NOT_FOUND);
      }
      const query = { _id: args.organizationId };
      const newValue = {};
      if (args.organizationInput.name) {
        newValue.name = args.organizationInput.name;
      }
      if (args.organizationInput.email) {
        const fetchedOrg = await Organization.findOne({
          email: args.organizationInput.email,
        });
        const emptyOrg = {};
        if (fetchedOrg == null) {
          emptyOrg.email = "erts";
        } else {
          emptyOrg.email = fetchedOrg.email;
        }

        if (fetchedOrg && !(emptyOrg.email == req.email)) {
          throw new Error(errorName.EMAIL_TAKEN);
        }

        newValue.email = args.organizationInput.email;
      }
      if (args.organizationInput.phone) {
        newValue.phone = args.organizationInput.phone;
      }
      if (args.organizationInput.description) {
        newValue.description = args.organizationInput.description;
      }
      if (args.organizationInput.contactPerson) {
        newValue.contactPerson = args.organizationInput.contactPerson;
      }
      if (args.organizationInput.bankAcc) {
        newValue.bankAcc = args.organizationInput.bankAcc;
      }
      if (args.organizationInput.longLat) {
        const longLat = args.organizationInput.longLat.split(","); // split latLong to assign into coordinates geoJson
        newValue.longLat = {
          type: "Point",
          coordinates: [longLat[0], longLat[1]], // [Long,Lat] - mongoose format
        };
      }
      const updatingOrg = await Organization.findByIdAndUpdate(
        query,
        { $set: newValue },
        { new: true }
      );
      return transformOrganization(updatingOrg);
    } catch (err) {
      throw err;
    }
  },
  verifyOrganization: async (
    { organizationId, verified },
    { req, errorName }
  ) => {
    if (!req.adminId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const query = { _id: organizationId };
      const newValue = {};
      if (verified) {
        newValue.verified = verified;
      }
      const verifyingOrg = await Organization.findByIdAndUpdate(
        query,
        { $set: newValue },
        { new: true }
      );
      return transformOrganization(verifyingOrg);
    } catch (err) {
      throw err;
    }
  },
};
