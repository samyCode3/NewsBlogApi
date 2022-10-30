const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { v4: uuidV4 } = require("uuid");
const auth = require("../middleware/auth.middleware");

const register = async (req, res) => {
  const { fullname, username, email, password, password2, phone, gender } = req.body;
  if (password.length < 8)
    return res
      .status(401)
      .json({
        status: "error-message",
        message: "Password should be at 8 characters",
      });
  if (/^[a-zA-Z0-9]*$/.test(password))
    return res.json({ status: "error", error: "Choose a stronger password" });
  if (password !== password2)
    return res
      .status(401)
      .json({ status: "error-message", message: "Passwords not the same" });
  const NewPassword = await bcrypt.hash(password, 8);

  await User.findOne({ email: email.toLowerCase() })
    .then((data) => {
      if (data)
        return res
          .status(401)
          .json({
            status: "error-message",
            message: "Email is used to verify other account",
          });
      const MyUser = new User({
        unique_id: uuidV4(),
        fullname: fullname,
        username: username,
        phone: phone,
        gender: gender,
        email: email,
        password: NewPassword,
        image: req.file.path,
      });

      MyUser.save().then((data) => {
        const token = auth.generateToken(data.unique_id);
        data.token = token;
        return res
          .status(201)
          .json({
            status: "Success-message",
            message: "User was successfully registered",
            token: token,
          });
      });
    })
    .catch((err) => {
      if (err)
        res.status(500).json({ status: 500, msg: "Internal server error" });
    });
};
//Login USers

const login = async (req, res, callback) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({
      status: "error-message",
      error: "Invaild User Detail provided",
    });

  User.findOne({ email: email })
    .then(async (data) => {
      if (!data || !(await bcrypt.compare(password, data.password)))
        return res.json({
          status: "error",
          error: "Email or password is incorrect",
        });
      const unique_id = data.unique_id;
      const token = auth.generateToken(unique_id);
      data.token = token;
      return res.json({ status: "success", success: data, token: token });
    })
    .catch((err) => {
      if (err)
        res.status(500).json({ status: 500, msg: "Internal server error" });
    });
};
//Collect User Data

const userProfile = async (req, res, next) => {
  const MyUser = req.data.data;
  await User.find({ unique_id: MyUser }).then((user) => {
    if (MyUser) res.json({ status: "ok", ok: user });
  });
};

// Get All newly onboarded Users
const GetAllUsers = async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    if (err)
      res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
// Delete User
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id).then((data) => {
      if (data)
        return res
          .status(200)
          .json({ status: 200, message: "Deletion was successfull" });
      res
        .status(400)
        .json({ status: "error", msg: "Deletion was not successfull" });
    });
  } catch (err) {
    if (err)
      res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
// Update User

const updateUser = async (req, res) => {
  try {
    const update = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(update);
  } catch (err) {
    if (err)
      res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
// Get User Stats
const GetStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const dataAggregate = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(dataAggregate);
  } catch (err) {
    if (err)
      res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
//forgotten Password
const forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exits" });
    }
    const unique_id = user.unique_id;
    const token = auth.forgettenPasswordToken(unique_id);
    return User.updateOne({ resetLink: token }).then((data) => {
      if (!data)
        return res.status(400).json({ message: "Password Link is invaild" });
      res.status(201).json({ success: `Email have been sent to you` });
    });
  });
};
//Reset Password
const ResetPassword = async (req, res) => {
  const { resetLink, newPassword } = req.body;
  const NewPassword = await bcrypt.hash(newPassword, 8);
  if (resetLink) {
    jwt.verify(resetLink, process.env.FORGET_PASSWORD_TOKEN, (err, data) => {
      if (err)
        return res
          .status(401)
          .json({ message: "Incorrect token or Token is expired" });
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user)
          return res
            .status(401)
            .json({ message: "User with this token does not exist." });
        const obj = {
          password: NewPassword,
          resetLink: "",
        };
        user = _.extend(user, obj);
        user.save((err, result) => {
          if (err)
            return res.status(400).json({ error: "reset password error" });
          res.status(200).json({ msg: "Your password have been reset" });
        });
      });
    });
  } else {
    return res.status(400).json({ error: "Authentication error!!!" });
  }
};
module.exports = {
  userProfile,
  register,
  login,
  deleteUser,
  GetAllUsers,
  updateUser,
  GetStats,
  forgotPassword,
  ResetPassword,
};
