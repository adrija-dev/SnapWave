import React, { useEffect, useRef, useState } from "react";
import { Image, Send, X, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import socket from "../socket.js";
import { apiRequest } from "../api";
import { assets } from "../assets/assets";

const ChatBox = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(
    localStorage.getItem("snapwave_user") || "null"
  );

  // --------------------------------
  // Get user
  // --------------------------------

  const fetchUser = async () => {
    try {
      const data = await apiRequest(`/user/${userId}`);

      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);

      toast.error(
        error.message || "Unable to load user"
      );
    }
  };

  // --------------------------------
  // Get conversation and messages
  // --------------------------------

  const fetchMessages = async () => {
    try {
      const data = await apiRequest(
        "/message/conversations"
      );

      const conversation =
        data.conversations?.find((conversation) =>
          conversation.members?.some(
            (member) =>
              member._id?.toString() ===
              userId?.toString()
          )
        );

      if (conversation) {
        setConversationId(conversation._id);

        const messageData = await apiRequest(
          `/message/${conversation._id}`
        );

        setMessages(
          messageData.messages || []
        );
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Load user + messages
  // --------------------------------

  useEffect(() => {
    if (!userId) return;

    fetchUser();
    fetchMessages();
  }, [userId]);

  // --------------------------------
  // Socket connection
  // --------------------------------

  useEffect(() => {
    if (!conversationId) return;

    socket.connect();

    socket.emit(
      "joinRoom",
      conversationId
    );

    const handleReceiveMessage = (
      message
    ) => {
      setMessages((prev) => {

        // Avoid duplicate messages
        const exists = prev.some(
          (msg) =>
            msg._id === message._id
        );

        if (exists) {
          return prev;
        }

        return [...prev, message];
      });
    };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      socket.disconnect();
    };
  }, [conversationId]);

  // --------------------------------
  // Auto scroll
  // --------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // --------------------------------
  // Send message
  // --------------------------------

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      setSending(true);

      const messageText = text.trim();

      const data = await apiRequest(
        "/message/send",
        {
          method: "POST",
          body: JSON.stringify({
            receiverId: userId,
            text: messageText,
          }),
        }
      );

      const newMessage = data.message;

      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg._id === newMessage._id
        );

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });

      setConversationId(
        newMessage.conversationId
      );

      // Send through socket
      socket.emit(
        "sendMessage",
        newMessage
      );

      setText("");
    } catch (error) {
      console.error(
        "Error sending message:",
        error
      );

      toast.error(
        error.message ||
          "Unable to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // --------------------------------
  // Send with Enter
  // --------------------------------

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">
          Loading chat...
        </p>
      </div>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="flex flex-col h-full bg-slate-50">

      {/* Header */}

      <div className="flex items-center gap-3 p-3 md:px-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">

        <button
          onClick={() =>
            navigate("/messages")
          }
          className="p-2 rounded-full hover:bg-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <img
          src={
            user?.profilePic ||
            assets.sample_profile
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-medium text-gray-800">
            {user?.username || "User"}
          </p>

          <p className="text-sm text-gray-500">
            @{user?.username || "user"}
          </p>
        </div>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 ? (

          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              No messages yet. Say hello 👋
            </p>
          </div>

        ) : (

          messages.map((msg) => {

            const senderId =
              msg.sender?._id ||
              msg.sender;

            const isMine =
              senderId?.toString() ===
              currentUser?._id?.toString();

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >

                  {msg.text && (
                    <p className="whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt=""
                      className="mt-2 max-h-48 rounded-md"
                    />
                  )}

                </div>

              </div>
            );
          })

        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Image Preview */}

      {image && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">

            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="h-16 rounded-md"
            />

            <button
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </button>

          </div>
        </div>
      )}

      {/* Input */}

      <div className="p-3 bg-white border-t flex items-center gap-2">

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        {/* Image button */}

        <label
          htmlFor="chatImage"
          className="cursor-pointer text-gray-500 hover:text-indigo-500"
        >
          <Image className="w-5 h-5" />
        </label>

        <input
          id="chatImage"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            setImage(
              e.target.files?.[0] ||
                null
            )
          }
        />

        {/* Send button */}

        <button
          onClick={sendMessage}
          disabled={
            sending ||
            !text.trim()
          }
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full disabled:opacity-50"
        >
          <Send size={18} />
        </button>

      </div>

    </div>
  );
};

export default ChatBox;