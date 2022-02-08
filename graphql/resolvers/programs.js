const Program = require("../../models/program");
const Donor = require("../../models/donor");
const Item = require("../../models/item");
const Organization = require("../../models/organization");
const { transformProgram } = require("./merge");

module.exports = {
  programs: async () => {
    try {
      const fetchedProgram = await Program.find();
      return fetchedProgram.map((program) => {
        return transformProgram(program);
      });
    } catch (err) {
      throw err;
    }
  },
  oneProgram: async (args) => {
    try {
      const fetchedProgram = await Program.findById(args.programId);
      return transformProgram(fetchedProgram);
    } catch (err) {
      throw err;
    }
  },
  createProgram: async (args, { req, errorName }) => {
    if (!req.organizationId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedOrganization = await Organization.findById(
        req.organizationId
      );
      if (!fetchedOrganization) {
        throw new Error(errorName.ORGANIZATION_NOT_FOUND);
      }
      const program = new Program({
        title: args.programInput.title,
        description: args.programInput.description,
        duration: args.programInput.duration,
        date: args.programInput.date,
        itemNeeded: args.programInput.itemNeeded,
        qtyNeeded: args.programInput.qtyNeeded,
        bankAcc: args.programInput.bankAcc,
        picName: args.programInput.picName,
        organization: fetchedOrganization,
      });
      const result = await program.save();
      fetchedOrganization.createdPrograms.push(program);
      await fetchedOrganization.save();
      return transformProgram(result);
    } catch (err) {
      throw err;
    }
  },
  updateProgram: async (args, { req, errorName }) => {
    try {
      const fetchedProgram = await Program.findById(args.programId);
      if (!fetchedProgram) {
        throw new Error(errorName.PROGRAM_NOT_FOUND);
      }
      const query = { _id: args.programId };
      const newValue = {};
      if (args.programInput.title) {
        newValue.title = args.programInput.title;
      }
      if (args.programInput.description) {
        newValue.description = args.programInput.description;
      }
      if (args.programInput.duration) {
        newValue.duration = args.programInput.duration;
      }
      if (args.programInput.date) {
        newValue.date = args.programInput.date;
      }
      if (args.programInput.itemNeeded) {
        newValue.itemNeeded = args.programInput.itemNeeded;
      }
      if (args.programInput.qtyNeeded) {
        newValue.qtyNeeded = args.programInput.qtyNeeded;
      }
      if (args.programInput.bankAcc) {
        newValue.bankAcc = args.programInput.bankAcc;
      }
      if (args.programInput.picName) {
        newValue.picName = args.programInput.picName;
      }
      const updatingProgram = await Program.findByIdAndUpdate(
        query,
        { $set: newValue },
        { new: true }
      );
      return transformProgram(updatingProgram);
    } catch (err) {
      throw err;
    }
  },
  deleteProgram: async (args, { req, errorName }) => {
    if (!req.organizationId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedProgram = await Program.findOne({ _id: args.programId });
      if (!fetchedProgram) {
        throw new Error(errorName.PROGRAM_NOT_FOUND);
      }
      await Program.deleteOne({ _id: args.programId });
      await Organization.updateOne(
        { createdPrograms: args.programId },
        { $pull: { createdPrograms: args.programId } }
      );
      const fetchedItem = await Item.findOne({ program: args.programId });
      await Donor.updateOne(
        { itemDonated: fetchedItem },
        { $pull: { itemDonated: fetchedItem } }
      );
      if (fetchedItem) {
        await Item.deleteMany({ programId: args.programId });
      }
      return transformProgram(fetchedProgram);
    } catch (err) {
      throw err;
    }
  },
};
