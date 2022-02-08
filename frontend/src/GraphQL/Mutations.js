import { gql } from "@apollo/client";

export const CREATE_DONOR = gql`
  mutation createDonor(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $email: String!
    $password: String!
    $longLat: String!
  ) {
    createDonor(
      donorInput: {
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        email: $email
        password: $password
        longLat: $longLat
      }
    ) {
      accessToken
      email
      donorId
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation createOrganization(
    $name: String!
    $description: String!
    $phone: String!
    $longLat: String!
    $email: String!
    $password: String!
    $contactPerson: String!
    $bankAcc: String!
  ) {
    createOrganization(
      organizationInput: {
        name: $name
        description: $description
        phone: $phone
        longLat: $longLat
        email: $email
        password: $password
        contactPerson: $contactPerson
        bankAcc: $bankAcc
      }
    ) {
      accessToken
      email
      organizationId
    }
  }
`;

export const CREATE_ADMIN = gql`
  mutation createAdmin($email: String!, $password: String!) {
    createAdmin(adminInput: { email: $email, password: $password }) {
      accessToken
      email
      adminId
    }
  }
`;

export const CREATE_PROGRAM = gql`
  mutation createProgram(
    $title: String!
    $description: String!
    $duration: String!
    $date: String!
    $itemNeeded: String!
    $qtyNeeded: String!
    $bankAcc: String!
    $picName: String!
  ) {
    createProgram(
      programInput: {
        title: $title
        description: $description
        duration: $duration
        date: $date
        itemNeeded: $itemNeeded
        qtyNeeded: $qtyNeeded
        bankAcc: $bankAcc
        picName: $picName
      }
    ) {
      title
      description
      duration
      date
      itemNeeded
      qtyNeeded
      bankAcc
      picName
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation updateOrganization(
    $organizationId: ID!
    $organization: OrganizationUpdateInput!
  ) {
    updateOrganization(
      organizationId: $organizationId
      organizationInput: $organization
    ) {
      name
      description
      email
      phone
      contactPerson
      bankAcc
      longLat
    }
  }
`;

export const UPDATE_DONOR = gql`
  mutation updateDonor($donorId: ID!, $donor: DonorUpdateInput!) {
    updateDonor(donorId: $donorId, donorInput: $donor) {
      firstName
      lastName
      email
      phone
      longLat
    }
  }
`;

export const UPDATE_PROGRAM = gql`
  mutation updateProgram($programId: ID!, $program: ProgramUpdateInput!) {
    updateProgram(programId: $programId, programInput: $program) {
      title
      description
      duration
      date
      itemNeeded
      qtyNeeded
      bankAcc
      picName
    }
  }
`;

export const DELETE_PROGRAM = gql`
  mutation deleteProgram($programId: ID!) {
    deleteProgram(programId: $programId) {
      title
    }
  }
`;

export const REMOVE_ORGANIZATION = gql`
  mutation deleteOrganization($organizationId: ID!) {
    deleteOrganization(organizationId: $organizationId) {
      name
      description
      email
    }
  }
`;

export const ADD_FOOD = gql`
  mutation createItem($programId: ID!, $food: [FoodInput!]) {
    createItem(programId: $programId, foodInput: $food) {
      food {
        name
        description
        quantity
      }
      donor {
        email
      }
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation updateItem($itemId: ID!, $item: ItemUpdateInput!) {
    updateItem(itemId: $itemId, itemInput: $item) {
      status
    }
  }
`;

export const VERIFY_ORGANIZATION = gql`
  mutation verifyOrganization($organizationId: ID!, $verified: String!) {
    verifyOrganization(organizationId: $organizationId, verified: $verified) {
      verified
    }
  }
`;
