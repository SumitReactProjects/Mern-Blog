import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {currentUser ? (
        <div className="flex items-center gap-2 mx-auto my-2">
          <p>Sign in as :</p>
          <img
            src={currentUser.profilePhoto}
            className="w-8 h-8 rounded-full"
            alt=""
          />
          <p className="text-blue-500 font-semibold">
            <Link to="/dashboard?tab=profile">@{currentUser.username}</Link>
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 mx-auto my-2">
          <p>Sign in as :</p>
          <p className="text-blue-500 font-semibold hover:text-underline">
            <Link to="/signin">You must be signin to comment</Link>
          </p>
        </div>
      )}
      {currentUser && (
        <form className="mt-3" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Write a Commment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            required
          />
          <div className="flex items-center justify-between mt-3">
            <p>{200 - comment.length} Characters Remaining</p>
            <Button type="submit" outline gradientDuoTone="purpleToBlue">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
};

export default CommentSection;
