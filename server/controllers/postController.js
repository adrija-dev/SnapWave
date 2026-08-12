import Post from "../models/Post.js";
import cloudinary from "../configs/cloudinary.js";

// Create Post
const createPost = async (req, res) => {
    try {

        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "SnapWave/Posts",
                },
                (error, uploadedImage) => {
                    if (error) reject(error);
                    else resolve(uploadedImage);
                }
            );

            stream.end(req.file.buffer);
        });

        const post = await Post.create({
            user: req.user._id,
            caption,
            image: result.secure_url,
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get Feed
const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("user", "username profilePic")
            .populate("comments.user", "username profilePic")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            posts,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Like / Unlike
const likePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const alreadyLiked = post.likes.includes(req.user._id);

        if (alreadyLiked) {

            post.likes.pull(req.user._id);

        } else {

            post.likes.push(req.user._id);

        }

        await post.save();

        res.json({
            success: true,
            message: alreadyLiked ? "Post unliked" : "Post liked",
            likes: post.likes.length,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Comment
const commentPost = async (req, res) => {

    try {

        const { text } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found",
            });

        }

        post.comments.push({
            user: req.user._id,
            text,
        });

        await post.save();

        res.json({
            success: true,
            message: "Comment added",
            comments: post.comments,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Delete
const deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found",
            });

        }

        if (post.user.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });

        }

        await post.deleteOne();

        res.json({
            success: true,
            message: "Post deleted",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// User Posts
const getUserPosts = async (req, res) => {

    try {

        const posts = await Post.find({
            user: req.params.userId,
        }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            posts,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export default {
    createPost,
    getAllPosts,
    likePost,
    commentPost,
    deletePost,
    getUserPosts,
};