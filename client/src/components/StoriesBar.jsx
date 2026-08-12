import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

import StoryModal from "./StoryModal";
import StoryViwer from "./StoryViwer";
import { apiRequest } from "../api";
import { assets } from "../assets/assets";

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/story");

      setStories(data.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error(error.message || "Unable to load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4 py-2">

      <div className="flex gap-4 pb-5">

        {/* Add Story */}
        <div
          onClick={() => setShowModal(true)}
          className="rounded-lg shadow-sm min-w-[120px] max-h-40 aspect-[3/4] cursor-pointer
          hover:shadow-lg transition-all duration-200
          border-2 border-dashed border-indigo-400 bg-gradient-to-b from-indigo-50 to-white"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">

            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>

            <p className="text-xs font-medium text-indigo-600">
              Add Story
            </p>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="min-w-[120px] max-h-40 aspect-[3/4] flex items-center justify-center">
            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Stories */}
        {!loading &&
          stories.map((story) => (
            <div
              onClick={() => setViewStory(story)}
              key={story._id}
              className="relative rounded-lg shadow min-w-[120px] max-h-40 aspect-[3/4] cursor-pointer
              hover:shadow-lg transition-all duration-200
              bg-gradient-to-b from-indigo-500 to-purple-600
              hover:from-indigo-700 hover:to-purple-800 active:scale-95 overflow-hidden"
            >

              {/* Story image */}
              <img
                src={story.image || assets.sample_profile}
                alt="story"
                className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-110 transition duration-500"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* User profile picture */}
              <img
                src={
                  story.user?.profilePic ||
                  assets.sample_profile
                }
                alt="profile"
                className="absolute size-8 top-3 left-3 z-10 rounded-full ring-2 ring-white shadow object-cover"
              />

              {/* Username */}
              <p className="absolute top-12 left-3 z-10 text-white text-sm font-medium truncate max-w-[96px]">
                {story.user?.username || "User"}
              </p>

              {/* Time */}
              <p className="text-white absolute bottom-2 right-2 z-10 text-xs">
                {moment(story.createdAt).fromNow()}
              </p>

            </div>
          ))}

      </div>

      {/* Add Story Modal */}
      {showModal && (
        <StoryModal
          setShowModal={setShowModal}
          fetchStories={fetchStories}
        />
      )}

      {/* View Story */}
      {viewStory && (
        <StoryViwer
          viewStory={viewStory}
          setViewStory={setViewStory}
        />
      )}

    </div>
  );
};

export default StoriesBar;