import React, { useState } from "react";
import { Camera, X } from "lucide-react";
import { apiRequest } from "../api";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const ProfileModal = ({ user, setUser, setShowEdit }) => {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [location, setLocation] = useState(user.location || "");

  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Update text information
      const data = await apiRequest("/user/update", {
        method: "PUT",
        body: JSON.stringify({
          username,
          bio,
          full_name: fullName,
          location,
        }),
      });

      let updatedUser = data.user;

      // Upload profile picture if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const imageData = await apiRequest("/user/profile-picture", {
          method: "POST",
          body: formData,
        });

        updatedUser = imageData.user;
      }

      setUser(updatedUser);
      setShowEdit(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 relative">

        {/* Close */}
        <button
          onClick={() => setShowEdit(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Edit Profile
          </h1>

          <p className="text-slate-600 text-sm">
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image */}
          <div className="flex items-center gap-6">

            <div className="relative">

              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : user.profilePic || assets.sample_profile
                }
                alt="profile"
                className="w-24 h-24 rounded-full object-cover shadow"
              />

              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full text-white cursor-pointer"
              >
                <Camera size={16} />
              </label>

              <input
                id="profileImage"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setProfileImage(e.target.files?.[0] || null)
                }
              />

            </div>

            <div>
              <h3 className="font-medium text-gray-800">
                Profile Picture
              </h3>

              <p className="text-sm text-gray-500">
                Upload a new profile picture
              </p>
            </div>

          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-600">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter username"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-600">
              Bio
            </label>

            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Tell people about yourself"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-600">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your location"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileModal;