import React, { useState, useEffect } from "react";
import { HiOutlineHandThumbUp, HiHandThumbUp } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { likePostAction, unlikePostAction } from "../../redux/actions/postActions";

const Like = ({ post }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth?.userData);

  const initialLikeState = {
    liked: post.likes.includes(userData?._id),
    localLikes: post.likes.length,
  };

  const [likeState, setLikeState] = useState(initialLikeState);

  useEffect(() => {
    setLikeState({
      liked: post.likes.includes(userData?._id),
      localLikes: post.likes.length,
    });
  }, [post.likes, userData?._id]);

  const toggleLike = async (e) => {
    e.preventDefault();
    const optimisticLikes = likeState.liked ? likeState.localLikes - 1 : likeState.localLikes + 1;

    setLikeState((prevState) => ({
      ...prevState,
      liked: !prevState.liked,
      localLikes: optimisticLikes,
    }));

    try {
      if (likeState.liked) {
        await dispatch(unlikePostAction(post._id));
      } else {
        await dispatch(likePostAction(post._id));
      }
    } catch (error) {
      setLikeState((prevState) => ({
        ...prevState,
        liked: !prevState.liked,
        localLikes: optimisticLikes,
      }));
    }
  };

  return (
    <button onClick={toggleLike} className="flex items-center cursor-pointer gap-1 text-lg">
      {likeState.liked ? (
        <HiHandThumbUp className="text-2xl" />
      ) : (
        <HiOutlineHandThumbUp className="text-2xl" />
      )}{" "}
      {likeState.localLikes}
    </button>
  );
};

export default Like;
