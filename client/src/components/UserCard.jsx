import React from 'react'
import {
  UserPlus2,
  UserCheck2,
  MessageCircle,
  Plus
} from 'lucide-react'

const UserCard = ({
  user,
  currentUser,
  onFollow,
  onConnect
}) => {
  return (
    <div className="p-4 pt-6 flex flex-col justify-between shadow border border-gray-200 rounded-md bg-white">

      {/* User Info */}
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt={user.full_name}
          className="rounded-full w-16 h-16 mx-auto shadow-md object-cover"
        />

        <p className="mt-4 font-semibold text-slate-900">
          {user.full_name}
        </p>

        {user.username && (
          <p className="text-gray-500 text-sm">
            @{user.username}
          </p>
        )}

        {user.bio && (
          <p className="text-gray-600 mt-2 text-sm px-4 line-clamp-2">
            {user.bio}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2">

        {/* Follow Button */}
        <button
          onClick={() => onFollow(user._id)}
          className={`flex-1 py-2 text-sm rounded flex items-center justify-center gap-2 transition active:scale-95
            ${
              user.is_followed
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:to-purple-700'
            }`}
        >
          {user.is_followed ? (
            <>
              <UserCheck2 className="w-4 h-4" />
              Following
            </>
          ) : (
            <>
              <UserPlus2 className="w-4 h-4" />
              Follow
            </>
          )}
        </button>

        {/* Connect / Message */}
        <button
          onClick={() => onConnect(user._id)}
          className="w-12 flex items-center justify-center border rounded-md text-slate-500 hover:bg-slate-100 transition active:scale-95"
        >
          {currentUser?.connections?.includes(user._id) ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export default UserCard
