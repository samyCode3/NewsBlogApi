const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  poster_id: {
    type: String,
    required: true,
  },
  news: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: "No comment made yet"
  },
  Unlikes: {
    type: Number,
    default: 0,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
}, {timestamps: true});

const NewsPost = mongoose.model("newspost", PostSchema);
module.exports = NewsPost;
