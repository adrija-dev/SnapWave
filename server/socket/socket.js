const onlineUsers = new Map();

const socketHandler = (io) => {

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        socket.on("join", (userId) => {

            onlineUsers.set(userId, socket.id);

            io.emit("onlineUsers", [...onlineUsers.keys()]);

        });

        socket.on("sendMessage", (data) => {

            const receiverSocket = onlineUsers.get(data.receiverId);

            if (receiverSocket) {

                io.to(receiverSocket).emit("receiveMessage", data);

            }

        });

        socket.on("disconnect", () => {

            for (const [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);

                    break;

                }

            }

            io.emit("onlineUsers", [...onlineUsers.keys()]);

            console.log("User Disconnected");

        });

    });

};

export default socketHandler;