const Item = require("../../models/item");
const Program = require("../../models/program");
const Donor = require("../../models/donor");
const { transformItem } = require("./merge");

module.exports = {
  items: async (args, { req, errorName }) => {
    try {
      const fetchedItem = await Item.find();
      return fetchedItem.map((item) => {
        return transformItem(item);
      });
    } catch (err) {
      throw err;
    }
  },
  oneItem: async (args) => {
    try {
      const fetchedItem = await Item.findById(args.itemId);
      return transformItem(fetchedItem);
    } catch (err) {
      throw err;
    }
  },
  createItem: async (args, { req, errorName }) => {
    if (!req.donorId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedProgram = await Program.findById(args.programId);
      const fetchedDonor = await Donor.findById(req.donorId);
      if (!fetchedDonor) {
        throw new Error(errorName.DONOR_NOT_FOUND);
      }
      const insertValue = {
        program: fetchedProgram,
        donor: fetchedDonor,
      };
      const item = new Item(insertValue);
      args.foodInput.forEach((tempFood) => {
        const tempFoodObj = {
          name: tempFood.name,
          description: tempFood.description,
          quantity: tempFood.quantity,
        };
        item.food.push(tempFoodObj);
      });

      const result = await item.save();
      fetchedProgram.items.push(item);
      await fetchedProgram.save();
      fetchedDonor.itemDonated.push(item);
      await fetchedDonor.save();
      return transformItem(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateItem: async (args, { req, errorName }) => {
    if (!req.organizationId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedItem = await Item.findById(args.itemId);
      if (!fetchedItem) {
        throw new Error(errorName.ITEM_NOT_FOUND);
      }
      const query = { _id: args.itemId };
      const newValue = {};
      if (args.itemInput.status) {
        newValue.status = args.itemInput.status;
      }
      if (args.itemInput.remarks) {
        newValue.remarks = args.itemInput.remarks;
      }
      const updatingItem = await Item.findByIdAndUpdate(
        query,
        { $set: newValue },
        { new: true }
      );
      return transformItem(updatingItem);
    } catch (err) {
      throw err;
    }
  },
  deleteItem: async (args, { req, errorName }) => {
    if (!req.organizationId && !req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    try {
      const fetchedItem = await Item.findById(args.itemId);
      if (!fetchedItem) {
        throw new Error(errorName.ITEM_NOT_FOUND);
      }
      await Item.deleteOne({ _id: args.itemId });
      await Program.updateOne(
        { items: args.itemId },
        { $pull: { items: args.itemId } }
      );
      return transformItem(fetchedItem);
    } catch (err) {
      throw err;
    }
  },
};
