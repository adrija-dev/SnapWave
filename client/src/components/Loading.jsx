import React from 'react'

const Loading = ({ height = "100vh" }) => {
  return (
    <div
      style={{ height }}
      className="flex items-center justify-center"
    >
      <div className="w-10 h-10 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
    </div>
  )
}

export default Loading
