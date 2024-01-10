const router = require("express").Router();
const passport = require("passport");

const {
  getPublicPosts,
  getPosts,
  getPost,
  createPost,
  confirmPost,
  rejectPost,
  deletePost,
  getCommunityPosts,
  getFollowingUsersPosts,
  likePost,
  unlikePost,
  addComment,
  savePost,
  unsavePost,
  getSavedPosts,
  clearPendingPosts,
  editPost,
  editComment
} = require("../controllers/post.controller");
const {
  postValidator,
  commentValidator,
  validatorHandler,
} = require("../middlewares/post/userInputValidator");
const {
  createPostLimiter,
  likeSaveLimiter,
  commentLimiter,
} = require("../middlewares/limiter/limiter");

const postConfirmation = require("../middlewares/post/postConfirmation");
const analyzeContent = require("../services/analyzeContent");
const processPost = require("../services/processPost");
const fileUpload = require("../middlewares/post/fileUpload");
const decodeToken = require("../middlewares/auth/decodeToken");

const requireAuth = passport.authenticate("jwt", { session: false }, null);

router.use(requireAuth, decodeToken);

router.get("/community/:communityId", getCommunityPosts);
router.get("/saved", getSavedPosts);
router.get("/:publicUserId/userPosts", getPublicPosts);
router.get("/:id/following", getFollowingUsersPosts);
router.get("/:id", getPost);
router.get("/", getPosts);

router.post("/confirm/:confirmationToken", confirmPost);
router.post("/reject/:confirmationToken", rejectPost);

router.post(
  "/:id/comment",
  commentLimiter,
  commentValidator,
  validatorHandler,
  analyzeContent,
  addComment
);

router.post(
  "/",
  createPostLimiter,
  fileUpload,
  postValidator,
  validatorHandler,
  analyzeContent,
  processPost,
  postConfirmation,
  createPost
);

router.delete("/pending", clearPendingPosts);
router.delete("/:id", deletePost);

router.use(likeSaveLimiter);

router.patch("/:id/save", savePost);
router.patch("/:id/unsave", unsavePost);
router.patch("/:id/like", likePost);
router.patch("/:id/unlike", unlikePost);
// PUT route to edit a post
// router.put('/edit/:id', editPost);
router.put('/posts/:postId', editPost);
// Add the route for editing a comment
router.put("/:commentId/edit", editComment);

module.exports = router;
