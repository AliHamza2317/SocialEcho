import { useSelector, useDispatch } from "react-redux";
import { useEffect,useState, lazy, useMemo, Suspense } from "react";
import { getPostAction, clearPostAction } from "../redux/actions/postActions";
import { useParams, useNavigate } from "react-router-dom";
import CommonLoading from "../components/loader/CommonLoading";
import FallbackLoading from "../components/loader/FallbackLoading";

const PostView = lazy(() => import("../components/post/PostView"));
const CommentSidebar = lazy(() => import("../components/post/CommentSidebar"));

const Post = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || "");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(post?.content || "");
  };

  const handleSaveEdit = async () => {
    try {
      // Make API call to update the post content
      const response = await fetch(`/api/posts/edit/${postId}`, {
        method: "PUT",
        body: JSON.stringify({
          content: editedContent,
          // You may need to include other fields like fileUrl and fileType if required
        }),
      });

      if (response.ok) {
        // If the update is successful, fetch the updated post
        dispatch(getPostAction(postId));
        setIsEditing(false);
      } else {
        // Handle error if the update fails
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("An error occurred while updating the post", error);
    }
  };





  const userData = useSelector((state) => state.auth?.userData);

  const joinedCommunities = useSelector((state) =>
    state.community?.joinedCommunities?.map(({ _id }) => _id)
  );

  useEffect(() => {
    dispatch(getPostAction(postId));

    return () => {
      dispatch(clearPostAction());
    };
  }, [dispatch, postId]);

  const post = useSelector((state) => state.posts?.post);

  const isAuthorized = useMemo(() => {
    return post && joinedCommunities?.includes(post.community._id);
  }, [post, joinedCommunities]);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate("/access-denied");
    }
  }, [isAuthorized, navigate]);

  if (!post || !joinedCommunities) {
    return (
      <div className="col-span-3 flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );
  }



  const handleEditCommentClick = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  };

  const handleSaveEditComment = async (commentId) => {
    try {
      // Make API call to update the comment content
      const response = await fetch(`/api/posts/${postId}/comment/${commentId}/edit`, {
        method: "PUT",
        body: JSON.stringify({
          content: editedCommentContent,
        }),
      });

      if (response.ok) {
        // If the update is successful, fetch the updated post
        dispatch(getPostAction(postId));
        setEditingCommentId(null);
      } else {
        // Handle error if the update fails
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("An error occurred while updating the comment", error);
    }
  };


  return (
    <Suspense fallback={<FallbackLoading />}>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <>
          <PostView post={post} userData={userData} />
          {isAuthorized && (
            <button onClick={handleEditClick}>Edit Post</button>
          )}
          {/* <CommentSidebar comments={post.comments} /> */}
          <CommentSidebar
        comments={post.comments}
        editingCommentId={editingCommentId}
        editedCommentContent={editedCommentContent}
        onEditCommentClick={handleEditCommentClick}
        onCancelEditComment={handleCancelEditComment}
        onSaveEditComment={handleSaveEditComment}
      />
        </>
      )}
    </Suspense>
  );
};

export default Post;









