const jwt = require("jsonwebtoken");

const createTokensOrganization = (org) => {
  const accessToken = jwt.sign(
    { organizationId: org.id, email: org.email },
    process.env.AUTH_KEY
  );
  return { accessToken };
};

const createTokensAdmin = (admin) => {
  const accessToken = jwt.sign(
    { adminId: admin.id, email: admin.email },
    process.env.AUTH_KEY
  );
  return { accessToken };
};

const createTokensDonor = (donor) => {
  const accessToken = jwt.sign(
    {
      donorId: donor.id,
      email: donor.email,
      longLat: String(donor.longLat.coordinates),
    },
    process.env.AUTH_KEY
  );
  return { accessToken };
};
exports.createTokensOrganization = createTokensOrganization;
exports.createTokensAdmin = createTokensAdmin;
exports.createTokensDonor = createTokensDonor;
