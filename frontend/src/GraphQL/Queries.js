import { gql } from "@apollo/client";

// DONORS
export const LOGIN_DONOR = gql`
  query Donor($email: String!, $password: String!) {
    loginDonor(email: $email, password: $password) {
      email
      accessToken
      longLat
    }
  }
`;

export const GET_DONORS = gql`
  query {
    donors {
      firstName
      lastName
      email
      phone
    }
  }
`;

export const GET_COUNT_USERS = gql`
  query {
    countUsers {
      countOrg
      countDonor
    }
  }
`;

export const GET_MEDONOR = gql`
  query {
    meDonor {
      firstName
      lastName
      email
      phone
      longLat
    }
  }
`;

export const GET_MEDONOR_ITEMS = gql`
  query {
    meDonor {
      itemDonated {
        _id
        status
        remarks
        food {
          name
          description
          quantity
        }
        program {
          _id
          title
          organization {
            _id
            name
            phone
          }
        }
      }
    }
  }
`;

export const GET_ONE_DONOR = gql`
  query Donor($donorId: ID!) {
    oneDonor(donorId: $donorId) {
      _id
      firstName
      lastName
      email
      phone
      longLat
    }
  }
`;

// ORGANIZATIONS
export const LOGIN_ORGANIZATION = gql`
  query Organization($email: String!, $password: String!) {
    loginOrganization(email: $email, password: $password) {
      name
      email
      accessToken
      organizationId
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query {
    organizations {
      _id
      name
      description
      bankAcc
      phone
      contactPerson
      email
      verified
    }
  }
`;

export const GET_NEAR_ORGANIZATION = gql`
  query Organization(
    $maxDistance: Int!
    $longitude: Float!
    $latitude: Float!
  ) {
    nearOrganizations(
      maxDistance: $maxDistance
      longitude: $longitude
      latitude: $latitude
    ) {
      _id
      name
      description
      longLat
    }
  }
`;

export const GET_ONE_ORGANIZATION = gql`
  query Organization($organizationId: ID!) {
    oneOrganization(organizationId: $organizationId) {
      _id
      name
      email
      description
      phone
      bankAcc
      contactPerson
      longLat
      verified
      createdPrograms {
        _id
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
  }
`;

export const GET_MEORGANIZATION = gql`
  query {
    meOrganization {
      _id
      name
      email
      phone
      createdPrograms {
        _id
        title
        description
      }
    }
  }
`;

// ADMIN
export const LOGIN_ADMIN = gql`
  query Admin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      email
      accessToken
    }
  }
`;

// PROGRAM
export const GET_PROGRAM = gql`
  query {
    programs {
      _id
      title
      description
    }
  }
`;

export const GET_ONE_PROGRAM = gql`
  query Program($programId: ID!) {
    oneProgram(programId: $programId) {
      _id
      title
      description
      duration
      date
      itemNeeded
      qtyNeeded
      bankAcc
      picName
      items {
        _id
        status
        remarks
        food {
          name
          description
          quantity
        }
        donor {
          _id
          email
          firstName
          lastName
          phone
        }
      }
    }
  }
`;

// ITEM
export const GET_ITEM = gql`
  query {
    items {
      _id
      food {
        _id
        name
        description
        quantity
      }
      donor {
        _id
        firstName
      }
      program {
        _id
        title
      }
    }
  }
`;

export const GET_ONE_ITEM = gql`
  query Item($itemId: ID!) {
    oneItem(itemId: $itemId) {
      _id
      food {
        _id
        name
        description
        quantity
      }
    }
  }
`;

export const GET_ONEUPDATE_ITEM = gql`
  query Item($itemId: ID!) {
    oneItem(itemId: $itemId) {
      program {
        _id
      }
    }
  }
`;
