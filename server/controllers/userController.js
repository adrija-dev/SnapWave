import User from "../models/User.js";

import cloudinary from "../configs/cloudinary.js";


// Get Logged-in User

const getProfile = async (req, res) => {

    try {

        res.json({
            success: true,
            user: req.user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// Update Profile

const updateProfile = async (req, res) => {

    try {

        const { username, bio, full_name, location } = req.body;

        const updatedUser = await User.findByIdAndUpdate(

            req.user._id,

            {
                username,
                bio,
                full_name,
                location
            },

            {
                new: true,
                runValidators: true
            }

        ).select("-password");

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// Upload Profile Picture

const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "SnapWave/ProfilePictures",
                },
                (error, uploadedImage) => {
                    if (error) reject(error);
                    else resolve(uploadedImage);
                }
            );

            stream.end(req.file.buffer);
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                profilePic: result.secure_url
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        res.json({
            success: true,
            message: "Profile picture updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get User By ID

const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// Search Users

const searchUsers = async (req, res) => {

    try {

        const keyword = req.params.keyword;

        const users = await User.find({

            username: {
                $regex: keyword,
                $options: "i"
            }

        }).select("-password");

        res.json({
            success: true,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export default {

    getProfile,
    updateProfile,
    uploadProfilePicture,
    getUserById,
    searchUsers

};