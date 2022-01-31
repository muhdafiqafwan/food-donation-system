const authOrganizationResolver = require("./authOrganization");
const authAdminResolver = require("./authAdmin");
const authDonorResolver = require("./authDonor");
const programsResolver = require("./programs");
const itemsResolver = require("./items");

const rootResolver = {
  ...authOrganizationResolver,
  ...authAdminResolver,
  ...authDonorResolver,
  ...programsResolver,
  ...itemsResolver,
};

module.exports = rootResolver;
