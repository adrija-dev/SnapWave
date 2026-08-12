import React, { useState } from "react";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2Icon,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import toast from "react-hot-toast";

const PostCard = ({ post, onDeleted }) => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes || []);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("snapwave_user") || "null"
  );

  const user = post.user || {};

  const isLiked = currentUser
    ? likes.includes(currentUser._id)
    : false;

  const handleLike = async () => {
    try {
      const data = await apiRequest(`/post/like/${post._id}`, {
        method: "PUT",
      });

      const userId = currentUser?._id;

      if (!userId) return;

      setLikes((currentLikes) =>
        currentLikes.includes(userId)
          ? currentLikes.filter((id) => id !== userId)
          : [...currentLikes, userId]
      );
    } catch (error) {
      toast.error(error.message || "Unable to like post");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await apiRequest(`/post/delete/${post._id}`, {
        method: "DELETE",
      });

      toast.success("Post deleted");

      if (onDeleted) {
        onDeleted(post._id);
      }
    } catch (error) {
      toast.error(error.message || "Unable to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const postContent = post.caption || "";

  const formattedContent = postContent.replace(
    /(#\w+)/g,
    '<span class="text-blue-500">$1</span>'
  );

  const isOwner =
    currentUser?._id &&
    user?._id &&
    currentUser._id === user._id;

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">

      {/* User information */}
      <div
        onClick={() => navigate("/profile/" + user._id)}
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={user.profilePic || assets.sample_profile}
          alt="profile"
          className="w-10 h-10 rounded-full shadow object-cover"
        />

        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium">
              {user.username || "User"}
            </span>

            <BadgeCheck className="w-4 h-4 text-blue-700" />
          </div>

          <div className="text-gray-500 text-sm">
            @{user.username || "user"} ·{" "}
            {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Caption */}
      {postContent && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: formattedContent,
          }}
        />
      )}

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full object-cover rounded-lg"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">

        <div className="flex items-center gap-1">
          <Heart
            className={`w-5 h-5 cursor-pointer ${
              isLiked
                ? "text-pink-500 fill-pink-500"
                : "hover:text-pink-500"
            }`}
            onClick={handleLike}
          />

          <span>{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <span>{post.comments?.length || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2Icon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
        </div>

        {/* Delete own post */}
        {isOwner && (
          <Trash2
            onClick={handleDelete}
            className={`w-5 h-5 ml-auto cursor-pointer hover:text-red-500 ${
              deleting ? "opacity-40" : ""
            }`}
          />
        )}

      </div>

    </div>
  );
};

export default PostCard;