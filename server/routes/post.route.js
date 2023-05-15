const router = require("express").Router();
const {
  getPublicPosts,
  getPosts,
  getPost,
  createPost,
  deletePost,
  getCommunityPosts,
  getFollowingUsersPosts,
  likePost,
  unlikePost,
  addComment,
  getComments,
  savePost,
  unsavePost,
  getSavedPosts,
} = require("../controllers/post.controller");
const fileUpload = require("../middlewares/post/fileUpload");
const passport = require("passport");
const decodeToken = require("../middlewares/auth/decodeToken");

const requireAuth = passport.authenticate("jwt", { session: false });

router.use(requireAuth, decodeToken);

router.get("/community/:communityId", getCommunityPosts);
router.get("/saved", getSavedPosts);
router.get("/:publicUserId/userPosts", getPublicPosts);
router.get("/:id/following", getFollowingUsersPosts);
router.get("/:id/comment", getComments);
router.get("/:id", getPost);
router.get("/", getPosts);

router.post("/:id/comment", addComment);
router.post("/", fileUpload, createPost);

router.delete("/:id", deletePost);

router.patch("/:id/save", savePost);
router.patch("/:id/unsave", unsavePost);
router.patch("/:id/like", likePost);
router.patch("/:id/unlike", unlikePost);

module.exports = router;