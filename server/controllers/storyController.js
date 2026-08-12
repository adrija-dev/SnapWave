import Story from "../models/Story.js";
import cloudinary from "../configs/cloudinary.js";

// Create Story
const createStory = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
            });
        }

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "SnapWave/Stories",
                },
                (error, uploadedImage) => {

                    if (error) reject(error);
                    else resolve(uploadedImage);

                }
            );

            stream.end(req.file.buffer);

        });

        const story = await Story.create({
            user: req.user._id,
            image: result.secure_url,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        res.status(201).json({
            success: true,
            message: "Story uploaded successfully",
            story,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get Stories
const getStories = async (req, res) => {

    try {

        const stories = await Story.find({
            expiresAt: { $gt: new Date() }
        })
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            stories,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Delete Story
const deleteStory = async (req, res) => {

    try {

        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found",
            });
        }

        if (story.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await story.deleteOne();

        res.json({
            success: true,
            message: "Story deleted",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export default {
    createStory,
    getStories,
    deleteStory,
};