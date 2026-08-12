import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import {
  dummyConnectionsData,
  dummyUserData
} from '../assets/assets'

const Discover = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const currentUser = dummyUserData

  useEffect(() => {
    setTimeout(() => {
      setUsers(dummyConnectionsData || [])
      setLoading(false)
    }, 600)
  }, [])

  const handleFollow = (userId) => {
    setUsers(prev =>
      prev.map(user =>
        user._id === userId
          ? { ...user, is_followed: !user.is_followed }
          : user
      )
    )
  }

  const handleConnect = (userId) => {
    if (!currentUser.connections.includes(userId)) {
      currentUser.connections.push(userId)
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.bio?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loading height="70vh" />

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Discover People
          </h1>
          <p className="text-gray-600">
            Let’s grow your network...
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 bg-white border-gray-200 rounded-md shadow-sm p-5 relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, username, bio..."
            className="pl-12 w-full py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Users */}
        {filteredUsers.length === 0 ? (
          <p className="text-center text-slate-400">
            No users found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard
                key={user._id}
                user={user}
                currentUser={currentUser}
                onFollow={handleFollow}
                onConnect={handleConnect}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Discover
