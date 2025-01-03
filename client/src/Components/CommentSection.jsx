import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

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

      console.log(data);

      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/signin");
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
        console.log(data);
      }
    } catch (error) {
      console.log(error);
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
      {comments.length === 0 ? (
        <p>No Comments yet....</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-300 py-1 px-3 rounded-sm font-medium">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="lg"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h1 className="mb-5 text-xl text-gray-500 dark:text-gray-200">
              Are you Sure you want to delete this Comment ?
            </h1>
            <div className="flex items-center justify-center gap-5">
              <Button
                color={"failure"}
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I am Sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.any, // name must be a string and is required
};
export default CommentSection;
