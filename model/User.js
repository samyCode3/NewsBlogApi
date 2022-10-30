const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const UserSchema = new mongoose.Schema(
  {
    unique_id: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    resetLink: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      Default: Date.now(),
    },
  },
  { timestamps: true }
);
UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id.toString()),
      delete returnedObject._id;
    delete returnedObject._V;
    delete returnedObject.password;
  },
});
UserSchema.plugin(uniqueValidator, { message: "Email already in use" });
const User = mongoose.model("User", UserSchema);
module.exports = User;
