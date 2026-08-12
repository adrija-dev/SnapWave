import { Image, X } from "lucide-react";
import React, { useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("snapwave_user") || "null"
  );

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      throw new Error("Please add some text or an image");
    }

    if (!image) {
      throw new Error("Please select an image");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("caption", content);

      formData.append("image", image);

      await apiRequest("/post/create", {
        method: "POST",
        body: formData,
      });

      setContent("");
      setImage(null);

      toast.success("Post added successfully!");

      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">

      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>

          <p className="text-slate-600">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form */}
        <div className="max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4">

          {/* User */}
          <div className="flex items-center gap-3">

            <img
              src={
                user?.profilePic ||
                user?.profile_picture ||
                assets.sample_profile
              }
              alt=""
              className="w-12 h-12 rounded-full shadow object-cover"
            />

            <div>
              <h2 className="font-semibold">
                {user?.username || "User"}
              </h2>

              <p className="text-sm text-gray-500">
                @{user?.username || "user"}
              </p>
            </div>

          </div>

          {/* Text */}
          <textarea
            className="w-full resize-none max-h-32 mt-4 text-sm outline-none placeholder-gray-400"
            placeholder="What's happening?"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* Selected image */}
          {image && (
            <div className="relative group w-fit">

              <img
                src={URL.createObjectURL(image)}
                className="max-h-60 rounded-md"
                alt=""
              />

              <div
                onClick={() => setImage(null)}
                className="absolute hidden group-hover:flex justify-center items-center inset-0 bg-black/40 rounded-md cursor-pointer"
              >
                <X className="w-6 h-6 text-white" />
              </div>

            </div>
          )}

          {/* Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-300">

            <label
              htmlFor="image"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <Image className="size-6" />
            </label>

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => {
                setImage(e.target.files?.[0] || null);
              }}
            />

            <button
              disabled={loading}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: "Uploading...",
                  success: "Post Added!",
                  error: (error) => error.message || "Post Not Added",
                })
              }
              className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-4 py-2 rounded-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreatePost;