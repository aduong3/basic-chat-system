import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = 3000;

const activeRooms = new Set<string>();

// 1. Create HTTP server from Express app.
const server = http.createServer(app);

// 2. create a new Socket.io server and attach it to HTTP server.
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// 3. Listen for new socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.data.nickname = null;
  socket.data.room = null;

  socket.on("create_room", ({ nickname, room }, callback) => {
    if (activeRooms.has(room)) {
      console.log(activeRooms);
      if (callback) {
        callback({
          success: false,
          message: `This room name is already being used! Please choose a different name.`,
        });
      }
      return;
    }

    socket.data.nickname = nickname;
    socket.data.room = room;

    activeRooms.add(room);
    socket.join(room);

    io.to(room).emit("receive_message", {
      nickname: "System",
      message: `${nickname} has created the room: ${room}`,
    });

    if (callback) callback({ success: true });
  });

  socket.on("join_room", ({ nickname, room }, callback) => {
    if (!activeRooms.has(room)) {
      if (callback) {
        callback({ success: false, message: "Room has not been made yet!." });
      }
      return;
    }

    socket.data.nickname = nickname;
    socket.data.room = room;

    socket.join(room);

    io.to(room).emit("receive_message", {
      nickname: "System",
      message: `${nickname} has joined!`,
    });

    if (callback) callback({ success: true });
  });

  socket.on("disconnect", () => {
    const { nickname, room } = socket.data;

    if (!nickname || !room) {
      console.log(`User ${socket.id} disconnected before joining a room.`);
      return;
    }

    socket.to(room).emit("receive_message", {
      nickname: "System",
      message: `${nickname} has left the room.`,
    });

    const socketsInRoom = io.sockets.adapter.rooms.get(room);
    if (!socketsInRoom || socketsInRoom?.size === 0) activeRooms.delete(room);
  });

  socket.on("send_message", (message) => {
    const { nickname, room } = socket.data;

    if (!room || !nickname) {
      socket.emit("error_message", {
        message: "Must be in a room or have a nickname first!",
      });
      return;
    }
    socket.broadcast.to(room).emit("receive_message", {
      nickname,
      message,
    });
  });
});

// 4. Start server listening on PORT
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
