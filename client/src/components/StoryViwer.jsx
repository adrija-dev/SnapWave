// import React, { useState } from 'react'
// import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
// import toast from 'react-hot-toast'

// const StoryModal = ({ setShowModal, fetchStories }) => {

//   const bgColors = [
//     "from-indigo-500 to-purple-600",
//     "from-pink-500 to-yellow-500",
//     "from-green-400 to-blue-500",
//     "from-red-400 to-pink-500",
//     "from-yellow-400 to-red-500"
//   ]

//   const [mode, setMode] = useState("text")
//   const [background, setBackground] = useState(bgColors[0])
//   const [text, setText] = useState("")
//   const [media, setMedia] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState(null)

//   const handleMediaUpload = (e) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setMedia(file)
//       setPreviewUrl(URL.createObjectURL(file))
//     }
//   }

//   const handleCreateStory = async () => {
//     // create story logic later
    
//   }

//   return (
//     <div className="fixed inset-0 z-50 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-gray-900 rounded-lg p-4">
        
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => setShowModal(false)}
//             className="text-white p-2 cursor-pointer"
//           >
//             <ArrowLeft />
//           </button>

//           <h2 className="text-2xl font-semibold">Create Story</h2>
//           <span className="w-10"></span>
//         </div>

//         {/* content goes here */}
//         <div className={`rounded-lg h-96 flex items-center justify-center relative bg-gradient-to-br ${background}`}>

//             {mode === 'text'&& (
//                 <textarea className="w-full h-full bg-transparent text-white p-4 resize-none focus:outline-none" placeholder="What's about Today?" value={text} onChange={(e) => setText(e.target.value)} />
//             )}

//             {
//                 mode !== 'text' && previewUrl && (
//                     media?.type.startsWith('image/') ? (
//                         <img src={previewUrl} alt='' className="object-contain max-h-full"/>
//                     ) : (
//                         <video src={previewUrl} className="object-contain max-h-full" />
//                     )
//                 )
//             }

//         </div>

//         <div className="flex mt-4 gap-2">
//             {/* background selection */}
//             {bgColors.map((color)=>(
//                 <button
//                     key={color}
//                     onClick={() => setBackground(color)}
//                     className={`w-6 h-6 rounded-full cursor-pointer bg-gradient-to-br ${color} ${background === color ? 'ring-2 ring-white' : 'ring'}`}
//                 />
//             ))}
//         </div>

//         <div className='flex gap-2 mt-4'>
//             <button onClick={()=>{setMode('text'); setMedia(null); setPreviewUrl(null)}} className={`flex-1 flex item-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
//                 <TextIcon size={18}/> Text
//             </button>
//             <label className={`flex-1 flex item-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
//                 <input type="file" accept="image/*,video/*" className="hidden" onChange={(e)=>{handleMediaUpload(e); setMode('media')}} />
//                 <Upload scale={18}/> Photo/Video
//             </label>
//         </div>
//             <button onClick={()=> toast.promise(handleCreateStory(), {
//                 loading: 'Saving...',
//                 success: <p>Story Created Successfully!</p>,
//                 error: e => <p>Failed to create story: {e.message}</p>
//             })} className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-950 active:scale-95 transition cursor-pointer'>
//                 <Sparkle size={18}/>Create Story
//             </button>
//       </div>
//     </div>
//   )
// }

// export default StoryViwer
// import { useEffect } from 'react'
// import { BadgeCheck, X } from 'lucide-react'
// import React, { useState } from 'react'

// const StoryViwer = ({viewStory,setViewStory}) => {

//     const [progress,setProgress] = useState(0);

//     useEffect(()=>{
//       let timer, progressInterval; 
//       if(viewStory&& viewStory.media_type !== 'video'){
//         setProgress(0);
//         const duration = 10000;
//         const setTime = 100;
//         let elapsed = 0;

//        progressInterval = setInterval(() => {
//           elapsed += setTime;
//           setProgress((elapsed / duration) * 100);
//         }, setTime);

//         //close time
//         timer = setTimeout(() => {
//           setViewStory(null)
//         }, duration);
//       }
//       return ()=>{
//         clearTimeout(timer);
//         clearInterval(progressInterval)
//       }
//     },[viewStory, setViewStory])

//     const handleClose = ()=>{
//       setViewStory(null)
//     }
//     if(!viewStory) return null;

//     const renderContent =()=>{
//       switch (viewStory.media_type) {
//         case 'image':
//           return(
//             <img src= {viewStory.media_url} alt='' className='max-2w-full max-h-screen object-contain'/>
//           );  
//         case 'video':
//           return(
//             <video onEnded={()=>setViewStory(null)} src= {viewStory.media_url} alt='' className='max-h-screen' controls autoPlay/>
//           );
//         case 'text':
//           return(
//           <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl texxt-center'>
//             {viewStory.content}
//           </div>
//           );
      
//         default:
//           return null;
//       }
//     }

//   return (
//     <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center' style={{backgroundColor:viewStory.media_type === 'text'? viewStory.background_color : '#000000'}}>
//       {/* progress bar */}
//       <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
//         <div className='h-full bg-white transition-all duration-100 liner' style={{width: '${progress}%'}}>

//         </div>
//       </div>
//       {/* user info -top left */}
//       <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'>
//         <img scr={viewStory.user?.profile_picture} alt='' className='size-7 sm:size-8 rounded-full object-cover border border-white'/>
//         <div>
//           <span>{viewStory.user?.full_name}</span>
//           <BadgeCheck size={18}/>
//         </div>
//       </div>

//       {/* close button */}
//       <button onClick={handleClose} className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'>
//         <X className='w-8 h-8 hover:scale-110 transition cursor-pointer'/>
//       </button>
//       {/* content wapper */}
//       <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
//           {renderContent()}
//       </div>
//     </div>
//   )
// }

// export default StoryViwer
import React, { useState, useEffect } from 'react'
import { BadgeCheck, X } from 'lucide-react'

const StoryViwer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer, progressInterval
    if (viewStory && viewStory.media_type !== 'video') {
      setProgress(0)
      const duration = 10000
      const setTime = 100
      let elapsed = 0

      progressInterval = setInterval(() => {
        elapsed += setTime
        setProgress((elapsed / duration) * 100)
      }, setTime)

      // auto-close after duration
      timer = setTimeout(() => {
        setViewStory(null)
      }, duration)
    }
    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [viewStory, setViewStory])

  const handleClose = () => {
    setViewStory(null)
  }

  if (!viewStory) return null

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return (
          <img
            src={viewStory.media_url}
            alt=''
            className='max-w-full max-h-screen object-contain'
          />
        )
      case 'video':
        return (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            className='max-h-screen'
            controls
            autoPlay
          />
        )
      case 'text':
        return (
          <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
            {viewStory.content}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center'
      style={{
        backgroundColor:
          viewStory.media_type === 'text'
            ? viewStory.background_color
            : '#000000',
      }}
    >
      {/* progress bar */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div
          className='h-full bg-white transition-all duration-100'
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* user info - top left */}
      <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50 text-white'>
        <img
          src={viewStory.user?.profile_picture}
          alt=''
          className='size-7 sm:size-8 rounded-full object-cover border border-white'
        />
        <div className='flex items-center gap-1'>
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>

      {/* close button */}
      <button
        onClick={handleClose}
        className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'
      >
        <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />
      </button>

      {/* content wrapper */}
      <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
        {renderContent()}
      </div>
    </div>
  )
}

export default StoryViwer
