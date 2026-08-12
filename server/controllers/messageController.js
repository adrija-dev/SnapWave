import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Send Message
const sendMessage = async (req, res) => {

    try {

        const { receiverId, text } = req.body;

        let conversation = await Conversation.findOne({
            members: { $all: [req.user._id, receiverId] }
        });

        if (!conversation) {

            conversation = await Conversation.create({
                members: [req.user._id, receiverId]
            });

        }

        const message = await Message.create({
            conversationId: conversation._id,
            sender: req.user._id,
            text,
        });

        res.status(201).json({
            success: true,
            message,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Get Messages
const getMessages = async (req, res) => {

    try {

        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).populate("sender", "username profilePic");

        res.json({
            success: true,
            messages,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Get User Conversations
const getConversations = async (req, res) => {

    try {

        const conversations = await Conversation.find({
            members: req.user._id
        }).populate("members", "username profilePic");

        res.json({
            success: true,
            conversations,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export default {
    sendMessage,
    getMessages,
    getConversations,
};