import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket: Socket = io(URL, {
  autoConnect: false,
});

type RoomData = {
  nickname: string;
  room: string;
};

type PromiseResponse = {
  success: boolean;
  message?: string;
};

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();

  socket.off("receive_message");
};

export const createRoom = ({
  nickname,
  room,
}: RoomData): Promise<PromiseResponse> => {
  return new Promise((resolve) => {
    socket.emit("create_room", { nickname, room }, (response) => {
      resolve(response);
    });
  });
};

export const joinRoom = ({
  nickname,
  room,
}: RoomData): Promise<PromiseResponse> => {
  return new Promise((resolve) => {
    socket.emit("join_room", { nickname, room }, (response) => {
      resolve(response);
    });
  });
};

export const sendMessage = (message: string) => {
  socket.emit("send_message", message);
};
