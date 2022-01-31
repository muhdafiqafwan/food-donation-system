const Program = require("../../models/program");
const Item = require("../../models/item");
const Organization = require("../../models/organization");
const Donor = require("../../models/donor");
const Admin = require("../../models/admin");

const showDate = async (time) => {
  const dt = new Date(time);
  dt.setMinutes(dt.getMinutes() - 30); //Minute
  return dt.toISOString();
};

const programz = async (programId) => {
  try {
    const programz = await Program.findById(programId);
    return transformProgram(programz);
  } catch (err) {
    throw err;
  }
};

const programs = async (programId) => {
  try {
    const programs = await Program.find({ _id: programId });
    return programs.map((program) => {
      return transformProgram(program);
    });
  } catch (err) {
    throw err;
  }
};

const foods = async (foodId) => {
  try {
    return foodId.map((food) => {
      return {
        ...food._doc,
        _id: food.id,
      };
    });
  } catch (err) {
    throw err;
  }
};

const items = async (itemId) => {
  try {
    const items = await Item.find({ _id: itemId });
    return items.map((item) => {
      return transformItem(item);
    });
  } catch (err) {
    throw err;
  }
};

const organizations = async (organizationId) => {
  try {
    const organizations = await Organization.findById(organizationId);
    return transformOrganization(organizations);
  } catch (err) {
    throw err;
  }
};

const donors = async (donorId) => {
  try {
    const donors = await Donor.findById(donorId);
    return transformDonor(donors);
  } catch (err) {
    throw err;
  }
};

const admins = async (adminId) => {
  try {
    const admins = await Admin.findById(adminId);
    return transformAdmin(admins);
  } catch (err) {
    throw err;
  }
};

const transformProgram = (program) => {
  return {
    ...program._doc,
    _id: program.id,
    items: items.bind(this, program._doc.items),
    organization: organizations.bind(this, program._doc.organization),
  };
};

const transformItem = (item) => {
  return {
    ...item._doc,
    _id: item.id,
    food: foods.bind(this, item.food),
    program: programz.bind(this, item.program),
    donor: donors.bind(this, item._doc.donor),
  };
};

const transformOrganization = (organization) => {
  return {
    ...organization._doc,
    _id: organization.id,
    password: null,
    longLat: String(organization._doc.longLat.coordinates), // mongoose return [Long,Lat]
    createdPrograms: programs(organization._doc.createdPrograms),
  };
};

const transformDonor = (donor) => {
  return {
    ...donor._doc,
    _id: donor.id,
    password: null,
    longLat: String(donor._doc.longLat.coordinates),
    itemDonated: items(donor._doc.itemDonated),
  };
};

const transformAdmin = (admin) => {
  return {
    ...admin._doc,
    _id: admin.id,
    password: null,
  };
};

exports.transformProgram = transformProgram;
exports.transformItem = transformItem;
exports.transformOrganization = transformOrganization;
exports.transformDonor = transformDonor;
exports.transformAdmin = transformAdmin;
