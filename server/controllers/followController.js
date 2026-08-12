import User from "../models/User.js";

// Follow / Unfollow User
const followUser = async (req, res) => {
    try {

        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {

            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);

            await currentUser.save();
            await targetUser.save();

            return res.json({
                success: true,
                message: "User unfollowed",
            });

        }

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.json({
            success: true,
            message: "User followed",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Followers List
const getFollowers = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .populate("followers", "username profilePic bio");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            followers: user.followers,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Following List
const getFollowing = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .populate("following", "username profilePic bio");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            following: user.following,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Suggested Users
const suggestedUsers = async (req, res) => {

    try {

        const users = await User.find({
            _id: { $ne: req.user._id }
        })
        .select("-password")
        .limit(10);

        res.json({
            success: true,
            users,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export default {
    followUser,
    getFollowers,
    getFollowing,
    suggestedUsers,
};