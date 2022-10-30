const express = require("express");
const router = express();
const newsPost = require("../services/post.services");
const auth = require("../middleware/auth.middleware");



router.post("/post", auth.AuthenticateUser, newsPost.NewsPost);
router.get("/fetch-news", newsPost.FetchNews);
router.get("/user-post/:poster_id", newsPost.FetchUsersNewsById);
router.get("/category", newsPost.GetNewsCategory);
router.put("/update-post/:id", auth.AuthenticateUser, newsPost.UpdateNewsPost);
router.delete("/delete-post/:id", auth.AuthenticateUser, newsPost.DeleteNewsPost);
// for comment Section
router.post("/comment/:id", newsPost.PostComment)

module.exports = router;
