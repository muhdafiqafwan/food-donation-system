const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Admin = require("../../models/admin");
const { transformAdmin } = require("./merge");
const { createTokensAdmin } = require("./createTokens");
// let pinGlobal;

module.exports = {
  meAdmin: async (args, { req, errorName }) => {
    if (!req.adminId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedAdmin = await Admin.findById(req.adminId);
      return transformAdmin(fetchedAdmin);
    } catch (err) {
      throw err;
    }
  },
  createAdmin: async (args, { res, errorName }) => {
    try {
      const fetchedAdmin = await Admin.findOne({
        email: args.adminInput.email,
      });
      if (fetchedAdmin) {
        throw new Error(errorName.ADMIN_EXIST);
      }
      const hashedPassword = await bcrypt.hash(args.adminInput.password, 12);
      const admin = new Admin({
        email: args.adminInput.email,
        password: hashedPassword,
      });
      const result = await admin.save();
      const { accessToken } = createTokensAdmin(admin);
      return {
        adminId: result.id,
        accessToken: accessToken,
        email: result.email,
      };
    } catch (err) {
      throw err;
    }
  },
  loginAdmin: async ({ email, password }, { res, errorName }) => {
    try {
      const fetchedAdmin = await Admin.findOne({ email: email });
      if (!fetchedAdmin) {
        throw new Error(errorName.ADMIN_NOT_EXIST);
      }
      const isEqual = await bcrypt.compare(password, fetchedAdmin.password);
      if (!isEqual) {
        throw new Error(errorName.INVALID_PASSWORD);
      }
      const { accessToken } = createTokensAdmin(fetchedAdmin);
      return {
        adminId: fetchedAdmin.id,
        accessToken: accessToken,
        email: fetchedAdmin.email,
      };
    } catch (err) {
      throw err;
    }
  },
  updateAdmin: async (args, { req, errorName }) => {
    if (!req.adminId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const query = { _id: req.adminId };
      const newValue = {};
      if (args.adminInput.email) {
        const fetchedAdmin = await Admin.findOne({
          email: args.adminInput.email,
        });
        const emptyAdmin = {};
        if (fetchedAdmin == null) {
          emptyAdmin.email = "erts";
        } else {
          emptyAdmin.email = fetchedAdmin.email;
        }
        if (fetchedAdmin && !(emptyAdmin.email == req.email)) {
          throw new Error(errorName.EMAIL_TAKEN);
        }
        newValue.email = args.adminInput.email;
      }
      if (args.adminInput.password) {
        newValue.password = await bcrypt.hash(args.adminInput.password, 12);
      }
      const updatingAdmin = await Admin.findByIdAndUpdate(
        query,
        { $set: newValue },
        { new: true }
      );
      return {
        ...updatingAdmin._doc,
        _id: updatingAdmin.id,
        password: null,
      };
    } catch (err) {
      throw err;
    }
  },
};
