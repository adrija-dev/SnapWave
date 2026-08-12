import React, { useEffect, useState } from "react";
import { Eye, MessagesSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { apiRequest } from "../api";
import { assets } from "../assets/assets";

const Messages = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest("/follow/suggested");

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);

      toast.error(
        error.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">

      <div className="max-w-5xl mx-auto p-6">

        {/* Title */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-800">
            Messages
          </h1>

          <p className="text-sm text-gray-600">
            Chat with your friends and followers
          </p>

        </div>

        {/* Users */}

        <div className="bg-white rounded-lg shadow divide-y">

          {users.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              No users available
            </div>

          ) : (

            users.map((user) => (

              <div
                key={user._id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >

                {/* Avatar */}

                <img
                  src={
                    user.profilePic ||
                    assets.sample_profile
                  }
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* User Info */}

                <div className="flex-1">

                  <p className="font-semibold text-gray-800">
                    {user.username}
                  </p>

                  <p className="text-sm text-gray-500">
                    @{user.username}
                  </p>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {user.bio || "No bio available"}
                  </p>

                </div>

                {/* Buttons */}

                <div className="flex gap-2">

                  {/* Message */}

                  <button
                    onClick={() =>
                      navigate(
                        `/messages/${user._id}`
                      )
                    }
                    className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-purple-300 text-slate-800 active:scale-95 transition cursor-pointer"
                    title="Message"
                  >
                    <MessagesSquare className="w-4 h-4" />
                  </button>

                  {/* Profile */}

                  <button
                    onClick={() =>
                      navigate(
                        `/profile/${user._id}`
                      )
                    }
                    className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-purple-300 text-slate-800 active:scale-95 transition cursor-pointer"
                    title="View profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default Messages;