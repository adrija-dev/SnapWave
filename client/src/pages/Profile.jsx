import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import ProfileModal from "../components/ProfileModal";
import { apiRequest } from "../api";

const Profile = () => {
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const [followLoading, setFollowLoading] = useState(false);

  // Fetch profile
  const fetchUser = async () => {
    try {
      // Logged-in user
      const currentUserData = await apiRequest("/user/profile");

      setCurrentUser(currentUserData.user);

      let profileUser;

      // Another user's profile
      if (profileId) {
        const profileData = await apiRequest(`/user/${profileId}`);
        profileUser = profileData.user;
      } else {
        // Own profile
        profileUser = currentUserData.user;
      }

      setUser(profileUser);

      // Get posts
      const postsData = await apiRequest(
        `/post/user/${profileUser._id}`
      );

      setPosts(postsData.posts || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.message || "Unable to load profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [profileId]);

  // Follow / Unfollow
  const handleFollow = async () => {
    if (!user?._id) return;

    try {
      setFollowLoading(true);

      const data = await apiRequest(`/follow/${user._id}`, {
        method: "PUT",
      });

      toast.success(data.message);

      // Get updated profile
      const profileData = await apiRequest(
        `/user/${user._id}`
      );

      setUser(profileData.user);
    } catch (error) {
      toast.error(error.message || "Unable to follow user");
    } finally {
      setFollowLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">

      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* Cover */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300">
            {user.cover_photo ? (
              <img
                src={user.cover_photo}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* User Information */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
            currentUser={currentUser}
            onFollow={handleFollow}
            followLoading={followLoading}
          />

        </div>

        {/* Tabs */}
        <div className="mt-6">

          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto justify-center">

            {["posts", "media", "likes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}

          </div>

          {/* Tab Content */}
          <div className="mt-6 flex flex-col items-center gap-6">

            {/* Posts */}
            {activeTab === "posts" && (
              posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  No posts yet.
                </p>
              )
            )}

            {/* Media */}
            {activeTab === "media" && (
              <div className="flex flex-wrap gap-4 mt-6 max-w-6xl justify-center">

                {posts
                  .filter((post) => post.image)
                  .map((post) => (
                    <a
                      key={post._id}
                      href={post.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      <img
                        src={post.image}
                        alt=""
                        className="w-64 aspect-video object-cover rounded-lg"
                      />

                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </a>
                  ))}

              </div>
            )}

            {/* Likes */}
            {activeTab === "likes" && (
              <p className="text-gray-500">
                No liked posts yet
              </p>
            )}

          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <ProfileModal
          user={user}
          setUser={setUser}
          setShowEdit={setShowEdit}
        />
      )}

    </div>
  );
};

export default Profile;