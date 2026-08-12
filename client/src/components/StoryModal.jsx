import React, { useState } from "react";
import {
  ArrowLeft,
  Sparkle,
  TextIcon,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../api";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-yellow-500",
    "from-green-400 to-blue-500",
    "from-red-400 to-pink-500",
    "from-yellow-400 to-red-500",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = async () => {
    if (!media) {
      throw new Error("Please select an image or video");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", media);

      await apiRequest("/story/create", {
        method: "POST",
        body: formData,
      });

      await fetchStories();

      setMedia(null);
      setPreviewUrl(null);
      setText("");

      setShowModal(false);

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-gray-900 rounded-lg p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">

          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>

          <h2 className="text-2xl font-semibold">
            Create Story
          </h2>

          <span className="w-10"></span>

        </div>

        {/* Story Preview */}
        <div
          className={`rounded-lg h-96 flex items-center justify-center relative bg-gradient-to-br ${background}`}
        >

          {/* Text */}
          {mode === "text" && (
            <textarea
              className="w-full h-full bg-transparent text-white p-4 resize-none focus:outline-none"
              placeholder="What's happening today?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {/* Image / Video */}
          {mode === "media" && previewUrl && (
            media?.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              <video
                src={previewUrl}
                className="object-contain max-h-full max-w-full"
                controls
              />
            )
          )}

        </div>

        {/* Background Selection */}
        {mode === "text" && (
          <div className="flex mt-4 gap-2">

            {bgColors.map((color) => (
              <button
                key={color}
                onClick={() => setBackground(color)}
                className={`w-6 h-6 rounded-full cursor-pointer bg-gradient-to-br ${color} ${background === color
                    ? "ring-2 ring-white"
                    : "ring"
                  }`}
              />
            ))}

          </div>
        )}

        {/* Text / Media */}
        <div className="flex gap-2 mt-4">

          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === "text"
                ? "bg-white text-black"
                : "bg-zinc-800"
              }`}
          >
            <TextIcon size={18} />
            Text
          </button>

          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === "media"
                ? "bg-white text-black"
                : "bg-zinc-800"
              }`}
          >

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                handleMediaUpload(e);
                setMode("media");
              }}
            />

            <Upload size={18} />
            Photo/Video

          </label>

        </div>

        {/* Create */}
        <button
          disabled={loading}
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
              success: "Story Created Successfully!",
              error: (e) =>
                e.message || "Failed to create story",
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-950 active:scale-95 transition cursor-pointer disabled:opacity-50"
        >
          <Sparkle size={18} />

          {loading ? "Creating..." : "Create Story"}

        </button>

      </div>

    </div>
  );
};

export default StoryModal;