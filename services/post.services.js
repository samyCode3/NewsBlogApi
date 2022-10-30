const newsPost = require("../model/Post.model");

const NewsPost = async (req, res) => {
  try {
    const makePost = new newsPost(req.body);
    await makePost.save().then((result) => {
      if (result)
        res.status(201).json({
          status: 201,
          success: "Your Post was successful",
        });
    });
  } catch (err) {
    if (err) res.status(400).json({ status: 400, msg: err.message });
  }
};
//Fectch All news
const FetchNews = async (req, res) => {
  await newsPost.find().then((data) => {
    res.status(200).json({
      status: 200,
      msg: data,
    });
  });
};
// fetch News by category
const GetNewsCategory = async (req, res) => {
  const qNews = req.query.news;
  const qCategory = req.query.category;
  try {
    let News;
    if (qNews) {
      News = await newsPost.find();
    } else if (qCategory) {
      News = await newsPost.find({
        categorie: {
          $in: [qCategory],
        },
      });
    } else {
      News = await newsPost.find();
    }
    res.status(200).json(News);
  } catch (err) {
    if (err)
      res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
//User post by id
const FetchUsersNewsById = async (req, res) => {
  try {
    const poster_id = req.params.poster_id;
    await newsPost.find({ poster_id: poster_id }).then((data) => {
      res.status(200).json({ status: 200, msg: data });
    });
  } catch (err) {
    if (err) res.status(500).json({ status: 500, msg: err.message });
  }
};
// Update News Post
const UpdateNewsPost = async (req, res) => {
  try {
    if (req.params.id !== req.body.poster_id) {
      return res
        .status(403)
        .json({ status: 403, msg: "sorry you can't perform this action" });
    } else {
      await newsPost.findByIdAndUpdate(
        req.body.post_id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res
        .status(201)
        .json({ status: 201, msg: "Changes have been made to your post" });
    }
  } catch (err) {
    if (err) res.status(500).json({ status: 500, msg: err.message });
  }
};

// Delete News Post
const DeleteNewsPost = async (req, res) => {
  if (req.params.id !== req.body.poster_id) {
    return res
      .status(403)
      .json({ status: 403, msg: "sorry you can't perform this action" });
  } else {
    await newsPost.findByIdAndDelete(req.body.post_id).then((result) => {
      if (!result)
        return res
          .status(400)
          .json({ status: 400, msg: "Something went Wrong...." });
    });
    res.status(200).json({ status: 200, msg: "Your Post is deleted..." });
  }
};



// For comment Section

const PostComment = async (req, res) => {
  try {
   const post = await newsPost.findByIdAndUpdate(req.params.id, {
        $push: req.body
    }, {new: true})
    post.save().then((data) => {
      if(data) res.status(200).json({status: 200, msg: "comment is posted"})
  })
  } catch (err) {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
  }
};

// Fetch  Comment
const FetchComment = async (req, res) => {
  try {
    await Post.find().then((err, result) => {
      if (err)
        return res
          .status(403)
          .json({ status: 403, msg: "Sorry unable to process this request" });
      if (result) res.status(200).json({ status: 200, msg: result });
    });
  } catch (err) {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
  }
};

module.exports = {
  NewsPost,
  FetchNews,
  UpdateNewsPost,
  DeleteNewsPost,
  GetNewsCategory,
  FetchUsersNewsById,
  PostComment
};
