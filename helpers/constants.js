const FormatError = require("easygraphql-format-error");

const formatError = new FormatError([
  {
    name: "DONOR_EXIST",
    message: "Donor with the email already exists.",
    statusCode: "400",
  },
  {
    name: "ORGANIZATION_EXIST",
    message: "Organization with the email already exists.",
    statusCode: "400",
  },
  {
    name: "ADMIN_EXIST",
    message: "Admin with the email already exists.",
    statusCode: "400",
  },
  {
    name: "DONOR_NOT_EXIST",
    message: "Donor with the email does not exist.",
    statusCode: "400",
  },
  {
    name: "ORGANIZATION_NOT_EXIST",
    message: "Organization with the email does not exist.",
    statusCode: "400",
  },
  {
    name: "ORGANIZATION_PENDING",
    message:
      "Your account has not been verified yet. Please wait for admin to verify your account.",
    statusCode: "400",
  },
  {
    name: "ORGANIZATION_REJECTED",
    message:
      "Your account has been rejected. Please contact admin for more details.",
    statusCode: "400",
  },
  {
    name: "ADMIN_NOT_EXIST",
    message: "Admin with the email does not exist.",
    statusCode: "400",
  },
  {
    name: "ORGANIZATION_NOT_FOUND",
    message: "Organization not found.",
    statusCode: "400",
  },
  {
    name: "DONOR_NOT_FOUND",
    message: "Donor not found.",
    statusCode: "400",
  },
  {
    name: "ADMIN_NOT_FOUND",
    message: "Admin not found.",
    statusCode: "400",
  },
  {
    name: "EMAIL_TAKEN",
    message: "Email is taken.",
    statusCode: "400",
  },
  {
    name: "EMAIL_NOT_VERIFIED",
    message: "Email is not verified.",
    statusCode: "400",
  },
  {
    name: "INVALID_PASSWORD",
    message: "Email or Password is incorrect.",
    statusCode: "400",
  },
  {
    name: "PROGRAM_NOT_FOUND",
    message: "Program not found.",
    statusCode: "400",
  },
  {
    name: "ITEM_NOT_FOUND",
    message: "Item not found.",
    statusCode: "400",
  },
]);

exports.formatError = formatError;
