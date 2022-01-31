const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const accessToken = authHeader.split(" ")[1]; //Bearer token
  if (!accessToken || accessToken === "") {
    req.isAuth = false;
    return next();
  }

  let data;
  try {
    data = jwt.verify(accessToken, process.env.AUTH_KEY);
    console.log(data);
  } catch (err) {
    console.log(err);
    req.isAuth = false;
    return next();
  }

  if (data.organizationId) {
    // if organization
    req.organizationId = data.organizationId;
    req.email = data.email;
    req.name = data.name;
    req.isAuth = true;
  }
  if (data.adminId) {
    // if admin
    req.adminId = data.adminId;
    req.isAuth = true;
  }
  if (data.donorId) {
    // if donor
    req.donorId = data.donorId;
    req.email = data.email;
    req.isAuth = true;
  }
  return next();
};
