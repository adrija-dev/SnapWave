import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./configs/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

await connectDB();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("joinRoom", (conversationId) => {

        socket.join(conversationId);

        console.log(
            `Socket ${socket.id} joined room ${conversationId}`
        );

    });

    socket.on("sendMessage", (message) => {

        io.to(message.conversationId).emit(
            "receiveMessage",
            message
        );

    });

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT}`
    );
});