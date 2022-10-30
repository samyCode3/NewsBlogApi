const User = require("../model/User");
const jwt = require("jsonwebtoken");
const config = process.env;

const AuthenticateUser = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.data = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
const AuthenticateAdmin = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-tokens"];

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

const generateToken = (unique_id) => {
  return jwt.sign({ data: unique_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
const generateAdminToken = (unique_id) => {
  return jwt.sign({ data: unique_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
const forgettenPasswordToken = (unique_id) => {
  return jwt.sign({ data: unique_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.RESET_PASSWORD_EXPIRED,
  });
};

// const NotFound = (req, res, next) => {

//   res.sendFile("404.html", { root : "./public/"})
// }

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      callback(null, true);
    } else {
      console.log(" only jpg, jpeg, png, gif file are only supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = {
  AuthenticateUser,
  AuthenticateAdmin,
  generateToken,
  generateAdminToken,
  forgettenPasswordToken,
  upload,
};
