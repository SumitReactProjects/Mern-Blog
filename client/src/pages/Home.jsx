import { Link } from "react-router-dom";
import CallToAction from "../Components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  console.log(posts);

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 lg:p-28 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold lg:text-6xl">
          Welcome to my Blog
        </h1>
        <p className="text-gray-500 text-md sm:text=sm">
          Here you will find the variety of articles and tutorials on topics
          such as web development software engineering and programming language{" "}
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View All Posts
        </Link>
      </div>
      <div className="p-6 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      {posts && posts.length > 0 && (
        <>
          <h1 className="text-2xl text-center pt-3 font-semibold">
            Recent posts
          </h1>
          <div className="max-w-6xl mx-auto p-3 flex flex-col md:flex-row flex-wrap gap-4 p-8 py-7">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} className="w-48" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
