import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { apiRequest } from '../api'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeeds = async () => {
    try {
      setLoading(true)

      const data = await apiRequest('/post')

      setFeeds(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeeds()
  }, [])



  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-between xl:gap-8">

      {/* Stories & posts */}
      <div className="w-full max-w-xl">
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDeleted={(deletedId) => {
                setFeeds((currentFeeds) =>
                  currentFeeds.filter((item) => item._id !== deletedId)
                );
              }}
            />
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="max-xl:hidden sticky top-0">
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className="font-semibold text-slate-800">Sponsored</h3>
          <img src={assets.sponsored_img} alt="" className="w-75 h-75 rounded-md" />
          <p className='text-slate-600'>Email Marketing</p>
          <p>Don’t just show up—stand out in the inbox.</p>
          {/* Sponsored content */}
        </div>

        <div>
          <RecentMessages />
          {/* Recent messages list */}
        </div>
      </div>

    </div>
  ) : <Loading />
}

export default Feed
