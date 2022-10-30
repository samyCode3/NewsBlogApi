const jwt = require("jsonwebtoken");
const config = process.env;
const Admin = require("../model/Admin");
const AuthenticateAdmin = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.Admin_SECRET);
    req.data = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
const generateAdminToken = (unique_id) => {
  return jwt.sign({ data: unique_id }, process.env.Admin_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
module.exports = {
  AuthenticateAdmin,
  generateAdminToken,
};
