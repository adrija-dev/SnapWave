import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");

  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggested, setSuggested] = useState([]);

  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);

  const navigate = useNavigate();

  // Get current user
  const fetchUser = async () => {
    try {
      const data = await apiRequest("/user/profile");

      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  // Fetch followers
  const fetchFollowers = async (userId) => {
    try {
      const data = await apiRequest(
        `/follow/followers/${userId}`
      );

      setFollowers(data.followers || []);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  // Fetch following
  const fetchFollowing = async (userId) => {
    try {
      const data = await apiRequest(
        `/follow/following/${userId}`
      );

      setFollowing(data.following || []);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  // Fetch suggested users
  const fetchSuggested = async () => {
    try {
      const data = await apiRequest("/follow/suggested");

      setSuggested(data.users || []);
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  };

  // Initial load
  const fetchConnections = async () => {
    try {
      setLoading(true);

      const currentUser = await fetchUser();

      if (currentUser?._id) {
        await Promise.all([
          fetchFollowers(currentUser._id),
          fetchFollowing(currentUser._id),
          fetchSuggested(),
        ]);
      }
    } catch (error) {
      toast.error(error.message || "Unable to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Follow / Unfollow
  const handleFollow = async (userId) => {
    try {
      setFollowLoading(userId);

      const data = await apiRequest(`/follow/${userId}`, {
        method: "PUT",
      });

      toast.success(data.message);

      // Refresh data
      if (user?._id) {
        await Promise.all([
          fetchFollowers(user._id),
          fetchFollowing(user._id),
          fetchSuggested(),
        ]);
      }
    } catch (error) {
      toast.error(error.message || "Unable to follow user");
    } finally {
      setFollowLoading(null);
    }
  };

  // Check whether current user follows someone
  const isFollowing = (userId) => {
    return following.some((item) => item._id === userId);
  };

  const dataArray = [
    {
      label: "Followers",
      value: followers,
      icon: Users,
    },
    {
      label: "Following",
      value: following,
      icon: UserCheck,
    },
    {
      label: "Discover",
      value: suggested,
      icon: UserPlus,
    },
  ];

  const currentData =
    dataArray.find((item) => item.label === currentTab)?.value || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Connections
          </h1>

          <p className="text-gray-600">
            Manage your network and discover new people
          </p>
        </div>

        {/* Counts */}
        <div className="mb-8 flex flex-wrap gap-6">

          {dataArray.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md"
            >
              <b>{item.value.length}</b>

              <p className="text-slate-600">
                {item.label}
              </p>
            </div>
          ))}

        </div>

        {/* Tabs */}
        <div className="inline-flex flex-wrap items-center border border-gray-300 rounded-md p-1 bg-white shadow-sm">

          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`cursor-pointer flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                currentTab === tab.label
                  ? "bg-indigo-500 text-white font-medium"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <tab.icon className="w-4 h-4" />

              <span className="ml-1">
                {tab.label}
              </span>
            </button>
          ))}

        </div>

        {/* Users */}
        <div className="flex flex-wrap gap-6 mt-6">

          {currentData.length === 0 ? (
            <div className="w-full text-center py-12 text-gray-500">
              No users found.
            </div>
          ) : (
            currentData.map((userItem) => (

              <div
                key={userItem._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md"
              >

                {/* Profile image */}
                <img
                  src={
                    userItem.profilePic ||
                    assets.sample_profile
                  }
                  alt=""
                  className="rounded-full w-12 h-12 shadow-md object-cover"
                />

                <div className="flex-1">

                  {/* Username */}
                  <p className="font-medium text-slate-700">
                    {userItem.username || "User"}
                  </p>

                  <p className="text-slate-500 text-sm">
                    @{userItem.username || "user"}
                  </p>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mt-1">
                    {userItem.bio
                      ? userItem.bio.slice(0, 50)
                      : "No bio available"}
                  </p>

                  {/* Buttons */}
                  <div className="flex max-sm:flex-col gap-2 mt-4">

                    {/* View profile */}
                    <button
                      onClick={() =>
                        navigate(
                          `/profile/${userItem._id}`
                        )
                      }
                      className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700 active:scale-95 transition text-white"
                    >
                      View Profile
                    </button>

                    {/* Following */}
                    {currentTab === "Following" && (
                      <button
                        disabled={
                          followLoading === userItem._id
                        }
                        onClick={() =>
                          handleFollow(userItem._id)
                        }
                        className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition disabled:opacity-50"
                      >
                        {followLoading === userItem._id
                          ? "..."
                          : "Unfollow"}
                      </button>
                    )}

                    {/* Followers */}
                    {currentTab === "Followers" && (
                      <button
                        disabled={
                          followLoading === userItem._id
                        }
                        onClick={() =>
                          handleFollow(userItem._id)
                        }
                        className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition disabled:opacity-50"
                      >
                        {followLoading === userItem._id
                          ? "..."
                          : isFollowing(userItem._id)
                          ? "Following"
                          : "Follow Back"}
                      </button>
                    )}

                    {/* Discover */}
                    {currentTab === "Discover" && (
                      <button
                        disabled={
                          followLoading === userItem._id
                        }
                        onClick={() =>
                          handleFollow(userItem._id)
                        }
                        className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition disabled:opacity-50"
                      >
                        {followLoading === userItem._id
                          ? "..."
                          : isFollowing(userItem._id)
                          ? "Following"
                          : "Follow"}
                      </button>
                    )}

                    {/* Message */}
                    {currentTab === "Following" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/messages/${userItem._id}`
                          )
                        }
                        className="p-2 rounded bg-slate-100 hover:bg-slate-200"
                        title="Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default Connections;