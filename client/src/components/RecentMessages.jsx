import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { apiRequest } from '../api'; 

const RecentMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentConversations = async () => {
        try {
            
            const data = await apiRequest('/message/conversations');
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentConversations();
    }, []);

    if (loading) {
        return (
            <div className='bg-white max-w-xs mt-4 p-4 rounded-md shadow text-xs text-slate-400'>
                Loading recent messages...
            </div>
        );
    }

    return (
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
            <h3 className='font-semibold text-slate-800 mb-4'>Recent Messages</h3>
            <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
                {conversations.length === 0 ? (
                    <p className='text-slate-400 py-2'>No recent messages</p>
                ) : (
                    conversations.map((conv) => {
                       
                        const otherUser = conv.members.find(
                            (member) => member._id !== conv.currentUserId // or member
                        ) || conv.members[0];

                        return (
                            <Link 
                                to={`/messages/${conv._id}`} 
                                key={conv._id} 
                                className='flex items-start gap-2 py-2 hover:bg-slate-100 px-1 rounded transition'
                            >
                                <img 
                                    src={otherUser?.profilePic || '/default-avatar.png'} 
                                    alt='' 
                                    className='w-8 h-8 rounded-full object-cover' 
                                />
                                <div className='w-full'>
                                    <div className='flex items-center justify-between'>
                                        <p className='font-medium text-slate-900'>
                                            {otherUser?.username || 'User'}
                                        </p>
                                        <p className='text-[10px] text-slate-400'>
                                            {moment(conv.updatedAt).fromNow()}
                                        </p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-slate-600 truncate max-w-[140px]'>
                                            Click to open chat
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentMessages;