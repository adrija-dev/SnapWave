import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    image: {
        type: String,
        required: true,
    },

    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
    },
},
{
    timestamps: true,
}
);

export default mongoose.model("Story", storySchema);