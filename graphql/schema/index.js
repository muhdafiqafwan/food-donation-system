const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Program {
  _id: ID!
  title: String!
  description: String!
  duration: String!
  date: String!
  itemNeeded: String!
  qtyNeeded: String!
  bankAcc: String!
  picName: String!
  items: [Item!]!
  organization: Organization!
}

type Food {
  _id: ID!
  name: String!
  description: String!
  quantity: Int!
}

type Item {
  _id: ID!
  food: [Food!]!
  status: String! 
  remarks: String 
  program: Program!
  donor: Donor!
}

type Organization {
  _id: ID!
  name: String!
  email: String!
  password: String!
  phone: String!
  description: String!
  contactPerson: String!
  bankAcc: String!
  verified: String! 
  createdPrograms: [Program!]!
  longLat: String!
}

type Count {
  countOrg: String
  countDonor: String
}

type Donor {
  _id: ID!
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  phone: String!
  longLat: String!
  itemDonated: [Item!]!
}

type Admin {
  _id: ID!
  email: String!
  password: String!
}

type AuthDataOrganization {
  organizationId: ID!
  name: String!
  accessToken: String!
  email: String!
}

type AuthDataDonor {
  donorId: ID!
  accessToken: String!
  email: String!
  longLat: String!
}

type AuthDataAdmin {
  adminId: ID!
  accessToken: String!
  email: String!
}

input ProgramInput {
  title: String!
  description: String!
  duration: String!
  date: String!
  itemNeeded: String!
  qtyNeeded: String!
  bankAcc: String!
  picName: String!
}

input FoodInput {
  name: String!
  description: String!
  quantity: Int!
}

input OrganizationInput {
  name: String!
  email: String!
  password: String!
  phone: String!
  description: String!
  contactPerson: String!
  bankAcc: String!
  longLat: String!
}

input DonorInput {
  email: String!
  firstName: String!
  lastName: String!
  phone: String!
  password: String!
  longLat: String!
}

input AdminInput {
  email: String!
  password: String!
}

input ProgramUpdateInput {
  title: String
  description: String
  duration: String
  date: String
  itemNeeded: String
  qtyNeeded: String
  bankAcc: String
  picName: String
}

input ItemUpdateInput {
  status: String
  remarks: String
}

input OrganizationUpdateInput {
  name: String
  email: String
  phone: String
  description: String
  contactPerson: String
  bankAcc: String
  longLat: String
}


input DonorUpdateInput {
  email: String
  firstName: String
  lastName: String
  phone: String
  longLat: String
}

type RootQuery {
  countUsers: Count!

  programs: [Program!]!
  oneProgram(programId: ID!): Program!

  items: [Item!]!
  oneItem(itemId: ID!): Item!
  
  organizations: [Organization!]!
  nearOrganizations(maxDistance: Int, longitude: Float, latitude: Float): [Organization!]!
  oneOrganization(organizationId: ID!): Organization!
  meOrganization: Organization!
  meProgramOrganization: [Program!]!

  donors: [Donor!]!
  oneDonor(donorId: ID!): Donor!
  meDonor: Donor!

  loginOrganization(email: String!,password: String!): AuthDataOrganization!
  loginDonor(email: String!,password: String!): AuthDataDonor!
  loginAdmin(email: String!,password: String!): AuthDataAdmin!
}

type RootMutation {
    createProgram(programInput: ProgramInput): Program
    updateProgram(programId: ID!, programInput: ProgramUpdateInput): Program
    deleteProgram(programId: ID!): Program!

    createItem(programId: ID!, foodInput: [FoodInput]): Item
    updateItem(itemId: ID!, itemInput: ItemUpdateInput): Item
    deleteItem(itemId: ID!): Item!

    createOrganization(organizationInput: OrganizationInput): AuthDataOrganization!
    updateOrganization(organizationId: ID!, organizationInput: OrganizationUpdateInput): Organization

    createDonor(donorInput: DonorInput): AuthDataDonor!
    updateDonor(donorId: ID!, donorInput: DonorUpdateInput): Donor

    createAdmin(adminInput: AdminInput): AuthDataAdmin!
    verifyOrganization(organizationId: ID!, verified: String!): Organization
  }

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
