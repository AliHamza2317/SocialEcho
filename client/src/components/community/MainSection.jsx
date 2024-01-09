import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import Home from "../../assets/home.jpg";

const MemoizedPost = React.memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => (
  <button
    className="bg-primary hover:bg-blue-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? "Loading..." : "Load More Posts"}
  </button>
);

const PostsList = ({ posts }) => (
  <div>{posts.map((post) => <MemoizedPost key={post._id} post={post} />)}</div>
);

const NoPostsMessage = () => (
  <div className="text-center text-gray-700 flex justify-center items-center flex-col">
    <p className="py-5 font-semibold">
      No posts to show. Join a community and post something.
    </p>
    <img loading="lazy" src={Home} alt="no post" />
  </div>
);

const MainSection = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts);
  const totalPosts = useSelector((state) => state.posts?.totalPosts);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getPostsAction(LIMIT, 0));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      dispatch(clearPostsAction());
    };
  }, [dispatch, LIMIT]);

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true);
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() => {
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, LIMIT, posts.length]);

  const memoizedPosts = useMemo(() => <PostsList posts={posts} />, [posts]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CommonLoading />
        </div>
      ) : posts.length > 0 ? (
        <>
          {memoizedPosts}
          {posts.length < totalPosts && (
            <LoadMoreButton
              onClick={handleLoadMore}
              isLoading={isLoadMoreLoading}
            />
          )}
        </>
      ) : (
        <NoPostsMessage />
      )}
    </div>
  );
};

export default MainSection;
