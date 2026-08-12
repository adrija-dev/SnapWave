import {
  Calendar,
  MapPin,
  PenBox,
  Verified,
} from "lucide-react";

import moment from "moment";
import React from "react";

import { assets } from "../assets/assets";

const UserProfileInfo = ({
  user,
  posts,
  profileId,
  setShowEdit,
  currentUser,
  onFollow,
  followLoading,
}) => {

  const isFollowing = user.followers?.some(
    (id) => id?.toString() === currentUser?._id?.toString()
  );

  return (
    <div className="relative py-4 px-6 md:px-8 bg-white">

      <div className="flex flex-col md:flex-row items-start gap-6">

        {/* Profile Picture */}
        <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full overflow-hidden">

          <img
            src={user.profilePic || assets.sample_profile}
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />

        </div>

        {/* User Info */}
        <div className="w-full pt-16 md:pt-0 md:pl-36">

          <div className="flex flex-col md:flex-row items-start justify-between">

            <div>

              {/* Name */}
              <div className="flex items-center gap-3">

                <h1 className="text-2xl font-bold text-gray-900">
                  {user.full_name || user.username || "User"}
                </h1>

                <Verified className="w-6 h-6 text-blue-500" />

              </div>

              {/* Username */}
              <p className="text-gray-600">
                {user.username
                  ? `@${user.username}`
                  : "Add a username"}
              </p>

            </div>

            {/* Edit / Follow */}
            {!profileId ? (

              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 border border-gray-300 rounded-lg hover:bg-blue-200 px-4 py-2 transition-colors font-medium mt-4 md:mt-0 cursor-pointer"
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>

            ) : (

              <button
                onClick={onFollow}
                disabled={followLoading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 mt-4 md:mt-0"
              >
                {followLoading
                  ? "..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>

            )}

          </div>

          {/* Bio */}
          <p className="text-gray-700 text-sm max-w-md mt-4">
            {user.bio || "No bio added yet."}
          </p>

          {/* Location / Joined */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 mt-4">

            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user.location || "Add Location"}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />

              Joined{" "}

              <span className="font-medium">
                {user.createdAt
                  ? moment(user.createdAt).fromNow()
                  : "Recently"}
              </span>

            </span>

          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 border-t border-gray-200 pt-4 mt-4">

            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {posts?.length || 0}
              </span>

              <span className="sm:text-sm text-xs text-gray-500 ml-1.5">
                Posts
              </span>
            </div>

            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {user.followers?.length || 0}
              </span>

              <span className="sm:text-sm text-xs text-gray-500 ml-1.5">
                Followers
              </span>
            </div>

            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {user.following?.length || 0}
              </span>

              <span className="sm:text-sm text-xs text-gray-500 ml-1.5">
                Following
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserProfileInfo;